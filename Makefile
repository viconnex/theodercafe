local-db:
	docker-compose exec postgresql psql -d theodercafe -U the

gcloud-sql:
	PGDATABASE=theodercafe gcloud sql connect theodercafe --user=the

ansible-deploy:
	ansible-playbook -i devops/ansible/hosts/prod devops/ansible/deploy.yml

ansible-provision:
	ansible-playbook -i devops/ansible/hosts/prod devops/ansible/playbook.yml

start:
	docker-compose up