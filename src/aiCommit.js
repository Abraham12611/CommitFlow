import { Configuration, OpenAIApi } from 'openai';

export async function aiCommitMessage(diff, apiKey) {
  const configuration = new Configuration({
    apiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Analyze the following code changes and generate a concise git commit message: ${diff}`,
      max_tokens: 100,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating AI commit message:', error);
    return 'AI commit message generation failed';
  }
}
