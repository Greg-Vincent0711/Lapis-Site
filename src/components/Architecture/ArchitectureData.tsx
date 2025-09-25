import gw from "../../assets/system_design/apigateway.svg";
import dynamodb from "../../assets/system_design/dynamodb.svg";
import lambda from "../../assets/system_design/lambda.svg";
import s3 from "../../assets/system_design/s3.svg";
import sm from "../../assets/system_design/secrets_manager.svg";
import ec2 from "../../assets/system_design/ec2.svg";
import type { ArchitectureDataType } from "../../types/types";

export const serviceNodes: ArchitectureDataType[] = [
  {
    id: "1",
    label: "EC2",
    data: {
      icon_img: ec2,
      popup_text:
        "Runs the stateful portion of Lapis. This is where user activity (like interactions on Discord) is captured and routed in AWS."
    }
  },
  {
    id: "2",
    label: "API Gateway",
    data: {
      icon_img: gw,
      popup_text:
        "Serves as Lapis' API. It securely exposes endpoints either to EC2 or this website if you're logged in."
    }
  },
  {
    id: "3",
    label: "DynamoDB",
    data: {
      icon_img: dynamodb,
      popup_text:
        "The NoSQL database layer of Lapis - responsible for the bot's memory."
    }
  },
  {
    id: "4",
    label: "S3",
    data: {
      icon_img: s3,
      popup_text:
        "Another version of memory, stores image data associated with a saved image, also creates the image URLs stored in DynamoDB."
    }
  },
  {
    id: "5",
    label: "Lambda",
    data: {
      icon_img: lambda,
      popup_text:
        "Serverless compute layer for Lapis. Handles the actual processing logic — performing CRUD operations for saved locations and processing queries around a user's seed."
    }
  },
  {
    id: "6",
    label: "AWS Secrets Manager",
    data: {
      icon_img: sm,
      popup_text:
        "Safely stores sensitive credentials like API keys, database connections, and Discord bot tokens. Used by EC2 and Lambda to securely access resources without hardcoding secrets."
    }
  }
];

    
/**
 * EC2: 1
 * Gateway: 2
 * DynamoDB: 3
 * S3: 4
 * Lambda: 5
 * Secrets Manager: 6
 **/

export const connections = [
    {
    // EC2 to API Gateway
        source: '1',
        target: '2',
        id: '1-2',
        label: '1-2'
    },
    // EC2 to Secrets Manager
    {
        source: '1',
        target: '6',
        id: '1-6',
        label: '1-6'
    },

    // API Gateway to Lambda
    {
        source: "2",
        target: "5",
        id: "2-5",
        label: "2-5"
    },

    // Lambda to S3
    {
        source: "5",
        target: "4",
        id: "5-4",
        label: "5-4"
    },

    // Lambda to DynamoDB
    {
        source: "5",
        target: "3",
        id: "5-3",
        label: "5-3"
    }
];