import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    getExecuteFunctions,
} from 'n8n-workflow';

export class VeniceEmbeddings implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Venice AI Embeddings',
        name: 'veniceEmbeddings',
        icon: 'fa:brain',
        group: ['transform'],
        version: 1,
        description: 'Generate embeddings using Venice AI API',
        defaults: {
            name: 'Venice Embeddings',
        },
        inputs: [{ type: 'main' } as const],
        outputs: [{ type: 'main' } as const],
        credentials: [
            {
                name: 'veniceApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Text Field',
                name: 'textField',
                type: 'string',
                default: 'text',
                description: 'Field name containing the text to embed',
                required: true,
            },
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                options: [
                    {
                        name: 'text-embedding-ada-002',
                        value: 'text-embedding-ada-002',
                    },
                    {
                        name: 'text-embedding-3-small',
                        value: 'text-embedding-3-small',
                    },
                    {
                        name: 'text-embedding-3-large',
                        value: 'text-embedding-3-large',
                    },
                ],
                default: 'text-embedding-ada-002',
                description: 'The embedding model to use',
            },
            {
                displayName: 'Output Field Name',
                name: 'outputField',
                type: 'string',
                default: 'embedding',
                description: 'Name of the field to store the embedding vector',
            },
        ],
    };

    async execute(this: ReturnType<typeof getExecuteFunctions>): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const textField = this.getNodeParameter('textField', i) as string;
                const model = this.getNodeParameter('model', i) as string;
                const outputField = this.getNodeParameter('outputField', i) as string;
                const credentials = await this.getCredentials('veniceApi', i);

                const text = items[i].json[textField] as string;

                if (!text) {
                    throw new NodeOperationError(
                        this.getNode(),
                        `No text found in field '${textField}' for item ${i}`,
                        { itemIndex: i }
                    );
                }

                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: 'https://api.venice.ai/api/v1/embeddings',
                    headers: {
                        'Authorization': `Bearer ${credentials.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: {
                        input: text,
                        model: model,
                    },
                    json: true,
                });

                if (!response.data || !response.data[0] || !response.data[0].embedding) {
                    throw new NodeOperationError(
                        this.getNode(),
                        'Invalid response from Venice AI API',
                        { itemIndex: i }
                    );
                }

                returnData.push({
                    json: {
                        ...items[i].json,
                        [outputField]: response.data[0].embedding,
                    },
                });

            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            ...items[i].json,
                            error: (error as Error).message,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}