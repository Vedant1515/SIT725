const API_URL = '/api/projects';

document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  loadProjects();
  
  document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const title = form.projectTitle.value.trim();
    const imageUrl = form.projectImageUrl.value.trim();
    const description = form.projectDescription.value.trim();
    
    if (!title || !imageUrl) {
      M.toast({html: 'Title and Image URL are required', classes: 'red'});
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          imageUrl,
          description
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Failed to add project');
      
      M.toast({html: 'Project added!', classes: 'green'});
      form.reset();
      loadProjects();
    } catch (error) {
      M.toast({html: `Error: ${error.message}`, classes: 'red'});
    }
  });
});

async function loadProjects() {
  try {
    const response = await fetch(API_URL);
    const projects = await response.json();
    
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';
    
    if (projects.length === 0) {
      container.innerHTML = `
        <div class="col s12 center-align">
          <div class="card-panel teal lighten-2 white-text">
            <i class="material-icons large">info</i>
            <h5>No Projects Found</h5>
            <p>Add your first project using the form above</p>
          </div>
        </div>
      `;
      return;
    }
    
    projects.forEach(project => {
      const col = document.createElement('div');
      col.className = 'col s12 m6 l4';
      col.innerHTML = `
        <div class="card project-card">
          <div class="card-image">
            <img class="project-image" src="${project.imageUrl}" 
                 alt="${project.title}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
            <div class="card-title-wrapper">
              <span class="card-title">${project.title}</span>
              ${project.description ? `<p class="card-description">${project.description.substring(0, 60)}${project.description.length > 60 ? '...' : ''}</p>` : ''}
            </div>
          </div>
          <div class="card-content">
            <h5>${project.title}</h5>
            <p>${project.description || 'No description available'}</p>
          </div>
          <div class="card-action">
            <a href="#" class="view-details-btn">
              <i class="material-icons tiny">info</i> View Details
            </a>
            <a href="#" class="delete-btn" data-id="${project._id}">
              <i class="material-icons tiny">delete</i> Delete
            </a>
          </div>
        </div>
      `;
      
      // Details Toggle
      col.querySelector('.view-details-btn').addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.project-card');
        const cardImage = card.querySelector('.card-image');
        const cardContent = card.querySelector('.card-content');
        const btnIcon = this.querySelector('i');
        const btnText = this;
        
        if (cardContent.style.display === 'none' || !cardContent.style.display) {
          cardImage.style.display = 'none';
          cardContent.style.display = 'block';
          btnIcon.textContent = 'arrow_back';
          btnText.innerHTML = '<i class="material-icons tiny">arrow_back</i> Back to Image';
        } else {
          cardImage.style.display = 'block';
          cardContent.style.display = 'none';
          btnIcon.textContent = 'info';
          btnText.innerHTML = '<i class="material-icons tiny">info</i> View Details';
        }
      });
      
      // Delete Project
      col.querySelector('.delete-btn').addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        try {
          const response = await fetch(`${API_URL}/${project._id}`, {
            method: 'DELETE'
          });
          
          if (!response.ok) throw new Error('Failed to delete project');
          
          M.toast({html: 'Project deleted!', classes: 'green'});
          col.remove();
          
          if (!container.querySelector('.col.s12.m6.l4')) {
            container.innerHTML = `
              <div class="col s12 center-align">
                <div class="card-panel teal lighten-2 white-text">
                  <i class="material-icons large">info</i>
                  <h5>No Projects Found</h5>
                  <p>Add your first project using the form above</p>
                </div>
              </div>
            `;
          }
        } catch (error) {
          M.toast({html: `Delete failed: ${error.message}`, classes: 'red'});
        }
      });
      
      container.appendChild(col);
    });
  } catch (error) {
    console.error('Error:', error);
    M.toast({html: `Error loading projects: ${error.message}`, classes: 'red'});
  }
}