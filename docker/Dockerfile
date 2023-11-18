FROM ubuntu:latest

# Install SSH, Python, sudo, and net-tools
RUN apt-get update && apt-get install -y openssh-server python3 sudo net-tools

# Add a user for Ansible
RUN useradd -m -s /bin/bash -G sudo ssluser

# Set up SSH
RUN mkdir /var/run/sshd
RUN echo 'root:YOUR_PASSWORD' | chpasswd
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Copy the public key
COPY id_rsa.pub /home/ssluser/.ssh/authorized_keys
RUN chown ssluser:ssluser /home/ssluser/.ssh/authorized_keys && \
    chmod 600 /home/ssluser/.ssh/authorized_keys

RUN echo "ssluser ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/ssluser

# Expose SSH port
EXPOSE 22

# Start SSH service
CMD ["/usr/sbin/sshd", "-D"]
