# DevOps    
**COMP.SE.140 DevOps Course**  

## Installation    
Before you begin, ensure that you have **Docker** and **Ansible** installed on your system.  

### Setting Up SSH Keys  
- Place your SSH public key inside the `docker` folder.   
- Update the `ansible_ssh_private_key_file` variable in the `ansible/hosts` file with the path to your private key.   

## Running the Code  
Open two separate terminals at the root of this project. In the first terminal, run Docker:  
```bash
docker-compose up  
```
In the second terminal, execute the Ansible playbook:  
```bash
ansible-playbook -i ansible/hosts ansible/git_install.yml
```
After executing these commands, you should see the uptime displayed.  

### O1
### O2
### O3
### O4

