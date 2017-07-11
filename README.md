## DevOps 101 - Provision an example environment
Provision an example environment with basic web application deployment (defaults to us-east-1 region).

### Example Provisioned Architecture
![architecture](aws-architecture.png)

* Install ruby - rbenv recommended
* Install fog - ```gem install fog```
* Install the [AWS-CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)

Create a Keypair (ex. DevOps) for your region and download the pem file.
```
cp DevOps.pem ~/.ssh
chmod 400 DevOps.pem
ssh-add ~/.ssh/DevOps
```

Configure DNS (Route 53)

Create Hosted Zone `example.com` and register your domain.  You are changing the default `example` so you need to create a Hosted Zone with `<yourname>.example.com`.
```
Name Servers *: (send your actual name servers, not example)
    ns-1376.awsdns-44.org
    ns-37.awsdns-04.com
    ns-670.awsdns-19.net
    ns-2006.awsdns-58.co.uk
```

Follow the [`provision.txt`](provision.txt) script

Add ELB to DNS (Route 53)
* Select Hosted Zone `example.com`
* Select Record Sets
* Select Create Record Sets
  *  Alias:  yes
  * Alias Target: click and select your ELB
  * Select Create

Point your browser to [`example.com`](http://example.com) and see if it works :)
```
curl example.com/ping - Health check
curl example.com/test - Test database connection
curl example.com/service - Test connection to services (if provisioned)
```

### Services - ECS, ECR and Docker

Supports Services with Docker, Amazon Container Service (ECS) and Registry (ECR).  `docker.txt` describes how to package the example service in a docker container and deploy it to ECS.

* Install Docker and Docker Compose
* Install the AWS-CLI
* Install JQ to parse json responses (sudo apt-get install jq)

Follow the [`docker/docker.txt`](docker/docker.txt) script

TBD - Create and configure ECS Clusters, Services and Task to run our containers on the ECS Instances we provisioned.  For now use the AWS console.

### S3 Website

Supports provisioning an S3 Website. See [Hosting a Static Website](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).

* Install the AWS-CLI
* Install JQ to parse json responses (sudo apt-get install jq)
```
cd example-ui
./deploy-ui
```

Creates [`ui.example.com`](http://ui.example.com) and syncs all content to the site.  You can pass in your site and zone into `deploy-ui` to create websites with different urls.  You must has access to the `example.com` domain for this to work.
```
./deploy-ui test        # creates test.example.com
./deploy-ui fred person # creates fred.person.com

```
Or you can just change the script :)

### SES Configuration

Supports configuring SES for email.  The script configures SES with a verified domain and admin email address.
It adds a Record Set for incoming email that sends mail to an S3 bucket.  It configures Route 53 to verify your domain and receive email.  You will need to make the Record Set active and resend the email verification when completed.
You will find the verification request email in the S3 `-receive-mail` bucket.

* Install the AWS-CLI
* Install JQ to parse json responses (sudo apt-get install jq)
```
cd provision
./dev-ses   # configures example.com by default
```

### Known Issues
* example doesn't provision the private ELBs or Elasticache in diagram
* random zone selection can lead to failover subnets in same availability zone
  * this will cause database(RDS) creation failure when provisioning services
* you must manually edited AMIs for each region
  * AMIs are specific to a region
* you must manually configure the NTP source on each instance to point to the bastion
  * edit ```/etc/ntp.conf``` and add the bastion as the server
* assumes you have access to ```example.com``` credentials for https
  * you can remove this from the ```dev-services``` script if you do not
