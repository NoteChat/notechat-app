export const AI_ENGINES = [{
    id: 'gpt-3.5-turbo',
    value: 'gpt-3.5-turbo',
    label: 'GPT-3'
}, {
    id: 'gpt-4-8k',
    value: 'gpt-4-8k',
    label: 'GPT-4-8K'
}]

export const getAIEngine = (id: string) => {
    return AI_ENGINES.find(engine => engine.id === id)
}

export const CurrencyBaseNumber = 1000;