pipeline {
    agent { docker { image 'mcr.microsoft.com/playwright:v1.39.0-jammy' } }
    
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

