import { Amplify } from "aws-amplify";
// v6 amplify configure
const configureAmplify = () => {
    Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: 'us-east-1_ytzLAQXvz',
            userPoolClientId: '4fv4br59s8ub1gt7hmmhkfi5sv'
          }
        }
      });
}

export default configureAmplify;