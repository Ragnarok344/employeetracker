const {prompt} = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
const sequelize = require('./config/connection');
const env = require('dotenv').config();


 
init();

function init() {

    const text = logo({name: 'Employee Tracker'}).render();
    console.log(text);

loadMainPrompts();
}


function loadMainPrompts() {
    prompt([
        {
        type:"list",
        name:"choice",
        message:"What would you like to do?",
        choices: [
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {
                name: "View All Employees By Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Remove Role",
                value: "REMOVE_ROLE"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "View Department Budget",
                value: "Department Budget"
            },
            {
                name: "Quit",
                value: "QUIT"
            }
        ]
}
    ]).then(res => {
        let choice = res.choice;
        switch(choice) {
            case "VIEW_EMPLOYEES":
                viewEmployee();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
                case "Department Budget":
                viewBudgetByDepartment();
                break;
            case "QUIT":
                quit();

        }
    }
    )
}

function viewEmployee() {
    sequelize.query('SELECT * FROM employee')
    .then(([rows]) => {
        let employees = rows;
        console.log('\n');
        console.table(employees);
        
    })
    .then(() => loadMainPrompts());

}

function viewEmployeesByDepartment() {
    sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentsChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            return prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to see employees for?",
                    choices: departmentsChoices
                }
            ])
        
            .then(res => sequelize.query('SELECT * FROM department WHERE Id = ?', { replacements: [res.departmentId], type: sequelize.QueryTypes.SELECT }))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts())
    });
}

function viewEmployeesByManager() {
    sequelize.query('SELECT * FROM employee WHERE manager_id IS NULL')
    .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which manager would you like to see employees for?",
                choices: managerChoices
            }
        ])
        .then(res => sequelize.query('SELECT * FROM employee WHERE manager_id = ?', { replacements: [res.managerId], type: sequelize.QueryTypes.SELECT }))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts());
    });
}

function removeEmployee() {
    sequelize.query('SELECT * FROM employee')
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to remove?",
                choices: employeeChoices
            }
        ])
        .then(res => sequelize.query('DELETE FROM employee WHERE id = ?', { replacements: [res.employeeId]}))
        .then(() => console.log('Employee removed'))
        .then(() => loadMainPrompts());
    });
}
 function updateEmployeeRole() {
        sequelize.query('SELECT * FROM employee')
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role would you like to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                sequelize.query('SELECT * FROM role')
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({id, title}) => ({
                        name: title,
                        value: id
                    }));
                    prompt([
                        {
                            type: "list",
                            name: "roleId",
                            message: "What is the employee's new role?",
                            choices: roleChoices
                        }
                    ])
                    .then(res => sequelize.query('UPDATE employee SET role_id = ? WHERE id = ?', { replacements: [res.roleId, employeeId]}))
                    .then(() => console.log('Employee role updated'))
                    .then(() => loadMainPrompts());
                });
            });
        });
 }

    function updateEmployeeManager() {
        sequelize.query('SELECT * FROM employee')
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({id, first_name, last_name}) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's manager would you like to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId = res.employeeId;
                sequelize.query('SELECT * FROM employee WHERE manager_id IS NULL')
                .then(([rows]) => {
                    let managers = rows;
                    const managerChoices = managers.map(({id, first_name, last_name}) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));
                    prompt([
                        {
                            type: "list",
                            name: "managerId",
                            message: "Who is the employee's new manager?",
                            choices: managerChoices
                        }
                    ])
                    .then(res => sequelize.query('UPDATE employee SET manager_id = ? WHERE id = ?', { replacements: [res.managerId, employeeId]}))
                    .then(() => console.log('Employee manager updated'))
                    .then(() => loadMainPrompts());
                });
            });
        });
    }

    function viewRoles() {
        sequelize.query('SELECT * FROM role')
        .then(([rows]) => {
            let roles = rows;
            console.log('\n');
            console.table(roles);
        })
        .then(() => loadMainPrompts());
    }

    function addRole() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentChoices
                }
            ])
            .then(role => {
                sequelize.query('INSERT INTO role SET ?', replacements   )
            })
            .then(() => console.log('Added ${role.title} to the database'))
            .then(() => loadMainPrompts());
        });
    }

    function removeRole() {
        sequelize.query('SELECT * FROM role')
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({id, title}) => ({
                name: title,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "Which role would you like to remove? (Will also delete employees!)",
                    choices: roleChoices
                }
            ])
            .then(res => sequelize.query('DELETE FROM role WHERE id = ?', { replacements: [res.roleId]}))
            .then(() => console.log('${role.title} removed'))
            .then(() => loadMainPrompts());
        });
    }

    function viewDepartments() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            console.log('\n');
            console.table(departments);
        })
        .then(() => loadMainPrompts());
    }

    function addDepartment() {
        sequelize.query('SELECT * FROM department') 
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    name: "name",
                    message: "What is the name of the department?"
                },
                
            ])
            .then(department => {
                sequelize.query('INSERT INTO department (name) VALUES (?)',
                {replacements:[department.name], type: sequelize.QueryTypes.INSERT})
            
            })
            .then(() => console.log('Department added to the database!'))
            .then(() => loadMainPrompts());
        });
    }

    function removeDepartment() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({id, name}) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to remove? (Will also delete employees and roles!)",
                    choices: departmentChoices
                }
            ])
            .then(res => sequelize.query('DELETE FROM department WHERE id = ?', { replacements: [res.departmentId]}))
            .then(() => console.log('removed from database!'))
            .then(() => loadMainPrompts());
        });
    }

    function viewBudgetByDepartment() {
        sequelize.query('SELECT * FROM department')
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({name, id}) => ({
                name: name,
                value: id
            }));
            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department's budget would you like to see?",
                    choices: departmentChoices
                }
            ])
            .then(res => sequelize.query('SELECT SUM(salary) as budget FROM role WHERE salary = ?', 
{ replacements: [res.departmentId], type: sequelize.QueryTypes.SELECT }))
.then(([rows]) => {
    let budget = rows[0].budget;
    console.log('\n');
    console.log(`Total budget: ${budget}`);
        })
    })
}