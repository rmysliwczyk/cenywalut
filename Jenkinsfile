pipeline {
    agent any

    stages {
        stage('Run New Container') {
            steps {
                sh 'docker compose up --build --force-recreate -d'
            }
        }
    }
}
