let chai, chaiHttp, mongoose, expect, server, Project;

before(async function () {
  // Dynamic imports
  chai = await import('chai');
  chaiHttp = await import('chai-http');
  mongoose = await import('mongoose');

  expect = chai.default?.expect || chai.expect;
  chai.default ? chai.default.use(chaiHttp.default) : chai.use(chaiHttp.default);

  server = await import('../server.js').then(m => m.default || m);
  Project = await import('../models/Project.js').then(m => m.default || m);
});

describe('Project Gallery API', function () {
  const testProject = {
    title: 'Test Project',
    imageUrl: 'https://test-image.com/image.jpg',
    description: 'This is a test project'
  };

  let projectId;

  before(async function () {
    const testDbUrl = 'mongodb://localhost:27017/projectGalleryTest';

    if (mongoose.connection?.readyState !== 0) {
      await mongoose.disconnect();
    }

    await mongoose.connect(testDbUrl); 
    console.log('Connected to test database');
  });

  beforeEach(async function () {
    await Project.deleteMany({});
  });

  after(async function () {
    if (mongoose.connection?.readyState === 1 && mongoose.connection.db) {
      try {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
        console.log('Test database dropped and connection closed');
      } catch (err) {
        console.error('Error during cleanup:', err.message);
      }
    } else {
      console.warn('Skipping cleanup: no active DB connection');
    }
  });

  describe('GET /api/projects', function () {
    it('should get all projects when no projects exist', async function () {
      const res = await chai.default.request(server).get('/api/projects');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('should get all projects when projects exist', async function () {
      await Project.create(testProject);
      const res = await chai.default.request(server).get('/api/projects');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array').with.lengthOf(1);
      expect(res.body[0]).to.include(testProject);
    });
  });

  describe('POST /api/projects', function () {
    it('should create a new project with all fields', async function () {
      const res = await chai.default.request(server).post('/api/projects').send(testProject);
      expect(res).to.have.status(201);
      expect(res.body).to.include(testProject);
      projectId = res.body._id;
    });

    it('should create a new project with only required fields', async function () {
      const minimalProject = {
        title: 'Minimal Project',
        imageUrl: 'https://minimal-image.com/image.jpg'
      };
      const res = await chai.default.request(server).post('/api/projects').send(minimalProject);
      expect(res).to.have.status(201);
      expect(res.body).to.include(minimalProject);
      expect(res.body).to.not.have.property('description');
    });

    it('should fail to create project without required title', async function () {
      const res = await chai.default.request(server).post('/api/projects').send({
        imageUrl: 'https://image.com/image.jpg',
        description: 'Missing title'
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('should fail to create project without required imageUrl', async function () {
      const res = await chai.default.request(server).post('/api/projects').send({
        title: 'Missing Image',
        description: 'This project has no image'
      });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /api/projects/:id', function () {
    it('should delete a project by id', async function () {
      const project = await Project.create(testProject);
      const res = await chai.default.request(server).delete(`/api/projects/${project._id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Project deleted successfully');
      const deleted = await Project.findById(project._id);
      expect(deleted).to.be.null;
    });

    it('should return 404 when deleting non-existent project', async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await chai.default.request(server).delete(`/api/projects/${fakeId}`);
      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'Project not found');
    });

    it('should return error for invalid project id format', async function () {
      const res = await chai.default.request(server).delete('/api/projects/invalid-id');
      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });
});
