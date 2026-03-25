const { initializePool } = require('./connection');
require('dotenv').config();

const initializeDatabase = async () => {
  try {
    const pool = await initializePool();
    const connection = await pool.getConnection();
    
    console.log('Initializing database schema...');

    // Users Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Manager', 'Employee') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table ready');

      // Employees Table (additional employee-specific metadata)
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS employees (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          employee_number VARCHAR(50),
          position VARCHAR(100),
          department VARCHAR(100),
          work_email VARCHAR(255),
          manager_id INT,
          start_date DATE,
          phone VARCHAR(50),
          bio LONGTEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('✓ Employees table ready');

    // Clients Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        industry VARCHAR(255),
        contact_name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Clients table ready');

    // Projects Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        deadline VARCHAR(255),
        status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Projects table ready');

    // Tasks Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        assigned_to INT,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        status ENUM('To Do', 'In Progress', 'Completed') DEFAULT 'To Do',
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        due_date VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Tasks table ready');

    // AI Content Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        topic VARCHAR(255) NOT NULL,
        content_type ENUM('Social Media', 'Blog', 'Email') NOT NULL,
        generated_content LONGTEXT NOT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ AI Content table ready');
    

    // Marketing Campaigns Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_name VARCHAR(255) NOT NULL,
        campaign_type VARCHAR(100),
        start_date DATE,
        end_date DATE,
        budget DECIMAL(10, 2),
        status ENUM('Planning', 'Active', 'Completed', 'Paused') DEFAULT 'Planning',
        description LONGTEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Marketing Campaigns table ready');

    // Content Production Table (tracks production workflow, links to clients/projects/campaigns)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS content_production (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        ai_content_id INT,
        content_type ENUM('Social Media', 'Blog', 'Email', 'Ad Copy', 'Other') DEFAULT 'Other',
        body LONGTEXT,
        client_id INT,
        project_id INT,
        campaign_id INT,
        created_by INT,
        assigned_to INT,
        status ENUM('Draft', 'In Review', 'Published') DEFAULT 'Draft',
        scheduled_date DATE,
        published_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ai_content_id) REFERENCES ai_content(id) ON DELETE SET NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Content Production table ready');

    // Marketing Performance Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS marketing_performance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        metric_name VARCHAR(255),
        metric_value DECIMAL(15, 2),
        metric_date DATE,
        conversions INT DEFAULT 0,
        leads INT DEFAULT 0,
        roi DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Marketing Performance table ready');

    // Marketing Performance Metrics (time-series metrics for dashboards)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS marketing_performance_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        campaign_id INT NOT NULL,
        metric_date DATE NOT NULL,
        impressions BIGINT DEFAULT 0,
        clicks BIGINT DEFAULT 0,
        conversions INT DEFAULT 0,
        leads INT DEFAULT 0,
        spend DECIMAL(12,2) DEFAULT 0.00,
        ctr DECIMAL(8,4) DEFAULT 0.0000,
        cpc DECIMAL(12,4) DEFAULT 0.0000,
        roi DECIMAL(8,4) DEFAULT 0.0000,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
        UNIQUE KEY campaign_date_unique (campaign_id, metric_date)
      )
    `);
    console.log('✓ Marketing Performance Metrics table ready');

    // Contributions Table (links content, campaigns, projects, clients)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        contribution_type ENUM('Social Media', 'Blog', 'Email', 'Ad Copy', 'Other') DEFAULT 'Other',
        source ENUM('Content', 'Marketing') DEFAULT 'Content',
        ai_generated TINYINT(1) DEFAULT 0,
        ai_content_id INT,
        campaign_id INT,
        project_id INT,
        client_id INT,
        created_by INT,
        assigned_to INT,
        status ENUM('Draft', 'In Review', 'Published') DEFAULT 'Draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (ai_content_id) REFERENCES ai_content(id) ON DELETE SET NULL,
        FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(id) ON DELETE SET NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Contributions table ready');

    // Check if admin user exists
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    
    if (rows[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('password123', 10);

      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@erp.com', hashedPassword, 'Admin']
      );
      console.log('✓ Seed data added (Admin user)');
    }

    // Seed a Manager and two Employees (if they don't already exist)
    const [mgrRow] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', ['manager@erp.com']);
    if (mgrRow[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('password123', 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Manager User', 'manager@erp.com', hashedPassword, 'Manager']
      );
      console.log('✓ Seed data added (Manager user)');
    }

    const [emp1Row] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', ['employee1@erp.com']);
    if (emp1Row[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('password123', 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Employee One', 'employee1@erp.com', hashedPassword, 'Employee']
      );
      console.log('✓ Seed data added (Employee One)');
    }

    const [emp2Row] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE email = ?', ['employee2@erp.com']);
    if (emp2Row[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = bcrypt.hashSync('password123', 10);
      await connection.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Employee Two', 'employee2@erp.com', hashedPassword, 'Employee']
      );
      console.log('✓ Seed data added (Employee Two)');
    }

    // Seed a sample client and project and assign sample tasks to employees
    const [clientCount] = await connection.execute('SELECT COUNT(*) as count FROM clients WHERE company_name = ?', ['Sample Client']);
    if (clientCount[0].count === 0) {
      await connection.execute(
        'INSERT INTO clients (company_name, industry, contact_name, phone, email) VALUES (?, ?, ?, ?, ?)',
        ['Sample Client', 'Marketing', 'Client Contact', '1234567890', 'client@example.com']
      );
      console.log('✓ Seed data added (Sample Client)');
    }

    // Ensure a sample project exists
    const [projCount] = await connection.execute('SELECT COUNT(*) as count FROM projects WHERE title = ?', ['Sample Project']);
    if (projCount[0].count === 0) {
      const [clientRow] = await connection.execute('SELECT id FROM clients WHERE company_name = ?', ['Sample Client']);
      const clientId = clientRow[0].id;
      await connection.execute(
        'INSERT INTO projects (client_id, title, description, deadline, status) VALUES (?, ?, ?, ?, ?)',
        [clientId, 'Sample Project', 'This is a seeded sample project for testing.', null, 'In Progress']
      );
      console.log('✓ Seed data added (Sample Project)');
    }

    // Create sample tasks assigned to Employee One and Employee Two
    const [projectRow] = await connection.execute('SELECT id FROM projects WHERE title = ?', ['Sample Project']);
    const projectId = projectRow[0].id;

    const [emp1] = await connection.execute('SELECT id FROM users WHERE email = ?', ['employee1@erp.com']);
    const [emp2] = await connection.execute('SELECT id FROM users WHERE email = ?', ['employee2@erp.com']);
    const emp1Id = emp1[0]?.id;
    const emp2Id = emp2[0]?.id;

    if (emp1Id) {
      const [taskExists] = await connection.execute('SELECT COUNT(*) as count FROM tasks WHERE title = ? AND assigned_to = ?', ['Onboard client assets', emp1Id]);
      if (taskExists[0].count === 0) {
        await connection.execute(
          'INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [projectId, emp1Id, 'Onboard client assets', 'Collect logos, brand guidelines, and access to ad accounts.', 'To Do', 'High', null]
        );
        console.log('✓ Seed task added (Onboard client assets -> Employee One)');
      }
    }

    if (emp2Id) {
      const [taskExists2] = await connection.execute('SELECT COUNT(*) as count FROM tasks WHERE title = ? AND assigned_to = ?', ['Design social post', emp2Id]);
      if (taskExists2[0].count === 0) {
        await connection.execute(
          'INSERT INTO tasks (project_id, assigned_to, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [projectId, emp2Id, 'Design social post', 'Create a series of social images and copy for the campaign.', 'To Do', 'Medium', null]
        );
        console.log('✓ Seed task added (Design social post -> Employee Two)');
      }
    }

    // Ensure employees table has rows for seeded users (manager and employees)
    const ensureEmployeeRecord = async (email, position = null, department = null) => {
      const [u] = await connection.execute('SELECT id, email FROM users WHERE email = ?', [email]);
      if (!u || u.length === 0) return;
      const userId = u[0].id;
      const [exists] = await connection.execute('SELECT COUNT(*) as count FROM employees WHERE user_id = ?', [userId]);
      if (exists[0].count === 0) {
        await connection.execute('INSERT INTO employees (user_id, position, department, work_email, start_date) VALUES (?, ?, ?, ?, ?)', [userId, position, department, email, null]);
        console.log(`✓ Employee record created for ${email}`);
      }
    };

    await ensureEmployeeRecord('manager@erp.com', 'Manager', 'Operations');
    await ensureEmployeeRecord('employee1@erp.com', 'Content Specialist', 'Content');
    await ensureEmployeeRecord('employee2@erp.com', 'Designer', 'Creative');

    console.log('\n✅ Database initialization complete!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error.message || error);
    console.error('Full error:', error);
    process.exit(1);
  }
};

initializeDatabase();
