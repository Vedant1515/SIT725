document.addEventListener('DOMContentLoaded', function() {
  const API_URL = 'http://localhost:3001/api/projects';
  const form = document.getElementById('projectForm');

  // Load projects on startup
  loadProjects();

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = form.projectTitle.value.trim();
    const description = form.projectDescription.value.trim();
    const link = form.projectLink.value.trim();

    if (!title) {
      alert('Project title is required!');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, link })
      });

      if (!response.ok) throw new Error('Failed to add project');
      form.reset();
      loadProjects(); // Refresh the list
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add project. See console for details.');
    }
  });
});

async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  try {
    const response = await fetch('http://localhost:3001/api/projects');
    const projects = await response.json();
    
    container.innerHTML = projects.map(project => `
      <div class="col s12 m6 l4">
        <div class="card">
          <div class="card-image">
            <img src="${project.imageUrl}" alt="${project.title}">
            <span class="card-title">${project.title}</span>
          </div>
          <div class="card-content">
            <p>${project.description || 'No description'}</p>
          </div>
          <div class="card-action">
            ${project.link ? `<a href="${project.link}" target="_blank">View</a>` : ''}
            <a href="#" class="red-text delete-btn" data-id="${project._id}">Delete</a>
          </div>
        </div>
      </div>
    `).join('');

    // Add delete button handlers
    // Update the delete button event listener in your loadProjects function
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const projectId = btn.dataset.id;
    
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete project');
      }
      
      M.toast({html: 'Project deleted!', classes: 'green'});
      
      // Remove the card from the DOM immediately
      btn.closest('.col').remove();
      
      // Show empty state if no projects left
      if (document.querySelectorAll('.project-card').length === 0) {
        displayEmptyState();
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      M.toast({html: `Delete failed: ${error.message}`, classes: 'red'});
    }
  });
});
  } catch (error) {
    container.innerHTML = `<div class="center-align red-text">Error loading projects: ${error.message}</div>`;
  }
}
function displayEmptyState() {
  const container = document.getElementById('projectsContainer');
  container.innerHTML = `
    <div class="col s12 center-align">
      <div class="card-panel teal lighten-2 white-text">
        <i class="material-icons large">info</i>
        <h5>No Projects Found</h5>
        <p>Click the "Add Project" button to create your first project.</p>
      </div>
    </div>
  `;
}