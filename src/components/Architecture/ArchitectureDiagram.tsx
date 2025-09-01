/**
 * Renders a list of ArchitectureItems in a tree-based hierarchy using Reagraph
 * TODO
 */
import "./ArchitectureDiagram.css";
import { GraphCanvas, darkTheme, lightTheme } from "reagraph";
import ArchitectureItem from "./ArchitectureItem/ArchitectureItem";
import gw from "../../assets/system_design/apigateway.svg";
import discord from "../../assets/system_design/discord.svg";
import dynamodb from "../../assets/system_design/dynamodb.svg";
import lambda from "../../assets/system_design/lambda.svg";
import s3 from "../../assets/system_design/s3.svg";
import sm from "../../assets/system_design/secrets_manager.svg";

// Discord - > lambda, secrets manager -> apigw -> s3, dynamodb
const serviceNodes = [
    {
        id: '1',
        label: 'discord',
        data: {
            icon_img: discord,
            popup_text: "Discord"
        }
      },
      {
        id: '2',
        label: 'apigw',
        data: {
            icon_img: gw,
            popup_text: "API Gateway"
        }
      },
      {
        id: '3',
        label: 'db',
        data: {
            icon_img: dynamodb,
            popup_text: "DynamoDB"
        }
      },
      {
        id: '4',
        label: 's3',
        data: {
            icon_img: s3,
            popup_text: "S3"
        }
      },
      {
        id: '5',
        label: 'lambda',
        data: {
            icon_img: lambda,
            popup_text: "Lambda"
        }
      },
      {
        id: '6',
        label: 'sm',
        data: {
            icon_img: sm,
            popup_text: "Secrets Manager"
        }
      }
      
];
    
/**
 * IDs
 * Discord: 1
 * Gateway: 2
 * DynamoDB: 3
 * S3: 4
 * Lambda: 5
 * Secrets Manager: 6
 * 
 * Discord to API GW
 * Discord to Secrets Manager
 * API GW to Lambda
 * 
 * Lambda to S3
 * Lambda to DynamoDB
 * 
*/


const connections = [
    {
    // Discord to API Gateway
        source: '1',
        target: '2',
        id: '1-2',
        label: '1-2'
    },
    // Discord to Secrets Manager
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

/**
 * 
 * Deep Indigo → #2A1F72

Royal Purple → #5A2D91

Dark Slate Blue → #2C3E91

Midnight Blue → #1B1F3B

Dark Violet → #3E1D5C
 * 
 */


// background: linear-gradient(135deg, #5e5eff, #4a4aff);
export default function ArchitectureDiagram({id} : {id: string}){
    return(
        <section id={id} className="architecture_section">
            <header>
                <h1>System Architecture</h1>
            </header>
            <div style={{ position: "relative", width: '90%', height: '75%', background: "transparent"}}>
                <GraphCanvas
                        layoutType="hierarchicalTd"
                        nodes={serviceNodes}
                        edges={connections}
                        glOptions={{
                            alpha: true,
                            preserveDrawingBuffer: true
                        }}
                        theme={{
                            ...lightTheme,
                            canvas: {
                                ...lightTheme.canvas,
                                background: undefined
                            }
                        }}
                        renderNode={({ node }) => (
                            <ArchitectureItem
                            icon_img={node.data.icon_img}
                            popup_text={node.data.popup_text}
                            />
                        )}
                    />
            </div>
        </section>
    )
}

