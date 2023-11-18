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

## Discussion
The observed uptime duration appears unusually lengthy. Initially, I assumed that the uptime referred to my computer's uptime. However, this assumption was incorrect, as evidenced by my computer's actual uptime stats:
```bash
21:28  up 50 days,  6:12, 2 users, load averages: 1.96 1.74 1.87
```
This led me to reconsider the source of the uptime measurement. I hypothesized that it might relate to the runtime of the Docker application or Docker daemon. To test this, I restarted the Docker application and re-executed the commands. The result was as follows:
```bash
20:02:58 up 0 min,  0 users,  load average: 1.58, 0.41, 0.14
```
From this, it's evident that the uptime is indeed linked to the Docker daemon's runtime rather than any other factor.

### O1
ansible-playbook -i ansible/hosts ansible/git_install.yml

PLAY [Setup Git and Check Uptime] **********************************************************************************************************

TASK [Gathering Facts] *********************************************************************************************************************
ok: [127.0.0.1]

TASK [Ensure the latest version of Git is installed] ***************************************************************************************
ok: [127.0.0.1]

TASK [Check uptime of the host] ************************************************************************************************************
changed: [127.0.0.1]

TASK [Display the uptime] ******************************************************************************************************************
ok: [127.0.0.1] => {
    "uptime_result.stdout_lines": [
        " 19:24:20 up 1 day, 17:10,  0 users,  load average: 0.08, 0.02, 0.04"
    ]
}

PLAY RECAP *********************************************************************************************************************************
127.0.0.1                  : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
### O2
ansible-playbook -i ansible/hosts ansible/git_install.yml

PLAY [Setup Git and Check Uptime] **********************************************************************************************************

TASK [Gathering Facts] *********************************************************************************************************************
ok: [127.0.0.1]

TASK [Ensure the latest version of Git is installed] ***************************************************************************************
ok: [127.0.0.1]

TASK [Check uptime of the host] ************************************************************************************************************
changed: [127.0.0.1]

TASK [Display the uptime] ******************************************************************************************************************
ok: [127.0.0.1] => {
    "uptime_result.stdout_lines": [
        " 19:24:56 up 1 day, 17:10,  0 users,  load average: 0.12, 0.03, 0.04"
    ]
}

PLAY RECAP *********************************************************************************************************************************
127.0.0.1                  : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
### O3
ansible-playbook -i ansible/hosts ansible/git_install.yml

PLAY [Setup Git and Check Uptime] **********************************************************************************************************

TASK [Gathering Facts] *********************************************************************************************************************
ok: [127.0.0.1]

TASK [Ensure the latest version of Git is installed] ***************************************************************************************
changed: [127.0.0.1]

TASK [Check uptime of the host] ************************************************************************************************************
changed: [127.0.0.1]

TASK [Display the uptime] ******************************************************************************************************************
ok: [127.0.0.1] => {
    "uptime_result.stdout_lines": [
        " 19:26:13 up 1 day, 17:11,  0 users,  load average: 0.35, 0.09, 0.05"
    ]
}

PLAY RECAP *********************************************************************************************************************************
127.0.0.1                  : ok=4    changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
### O4
ansible-playbook -i ansible/hosts ansible/git_install.yml

PLAY [Setup Git and Check Uptime] **********************************************************************************************************

TASK [Gathering Facts] *********************************************************************************************************************
ok: [127.0.0.1]

TASK [Ensure the latest version of Git is installed] ***************************************************************************************
ok: [127.0.0.1]

TASK [Check uptime of the host] ************************************************************************************************************
changed: [127.0.0.1]

TASK [Display the uptime] ******************************************************************************************************************
ok: [127.0.0.1] => {
    "uptime_result.stdout_lines": [
        " 19:26:46 up 1 day, 17:12,  0 users,  load average: 0.19, 0.08, 0.05"
    ]
}

PLAY RECAP *********************************************************************************************************************************
127.0.0.1                  : ok=4    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

