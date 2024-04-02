pipeline {
    agent { docker { image 'node:16-alpine' } }
    
    stages {
        stage('Install playwright') {
            steps {

            sh '''
            npm i -D @playwright/test
            npx playwright install'''

                    }
        }
        
        stage('test') {
            steps {
                sh 'npx playwright test  '
            }
        }
    }
}

