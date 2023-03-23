MYSQL_HOST="18.218.83.178" 
MYSQL_USER="myAcc" 
MYSQL_PASSWORD="MyNewPass1!" 
MYSQL_DATABASE="studentDetails" 

node Server.js


sudo vim /etc/systemd/system/studentDetails.service

[Unit]
Description=Student Details
After=multi-user.target

[Service]
ExecStart=/usr/bin/node /home/ec2-user/lotr/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=student-details
User=ec2-user
EnvironmentFile=/home/ec2-user/lotr/app.env

[Install]
WantedBy=multi-user.target