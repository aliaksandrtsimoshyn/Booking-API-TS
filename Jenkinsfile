pipeline {
    //agent { docker { image 'mcr.microsoft.com/playwright:v1.39.0-jammy' } }

    agent {
    label 'docker' 
  }
    
    stages {
        stage('Install playwright') {
            agent {
        docker {
          label 'docker'
          image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
        }
      }
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

