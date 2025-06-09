import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class VeniceApi implements ICredentialType {
    name = 'veniceApi';
    displayName = 'Venice AI API';
    documentationUrl = 'https://docs.venice.ai/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Your Venice AI API key',
            required: true,
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://api.venice.ai',
            description: 'Base URL for Venice AI API (optional)',
        },
    ];

    test = {
        request: {
            baseURL: '={{$credentials.baseUrl || "https://api.venice.ai"}}',
            url: '/api/v1/models',
            method: 'GET',
            headers: {
                Authorization: 'Bearer {{$credentials.apiKey}}',
            },
        },
    };
}