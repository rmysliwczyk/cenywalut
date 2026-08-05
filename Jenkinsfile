pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t \"cenywalut-backend\" .'
            }
        }

        stage('Stop and Remove Existing Container') {
            steps {
                sh 'docker stop cenywalut-backend || true'
                sh 'docker rm cenywalut-backend || true'
            }
        }

        stage('Run New Container') {
            steps {
                sh 'docker run -d --restart always --name \"cenywalut-backend\" -p 8615:8615 \"cenywalut-backend\"'
            }
        }
    }
}
