import { Box, VStack, Input, Button, Text, Image, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { getClient } from '../lib/crud';

const Index = () => {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState('');
  const [tweetText, setTweetText] = useState('');
  const toast = useToast();
  const client = getClient('twitter-clone');

  useEffect(() => {
    const fetchTweets = async () => {
      const data = await client.getWithPrefix('tweet:');
      if (data) {
        setTweets(data.sort((a, b) => new Date(b.value.date) - new Date(a.value.date)));
      }
    };
    fetchTweets();
  }, []);

  const postTweet = async () => {
    if (!username || !tweetText) {
      toast({
        title: 'Error',
        description: 'Username and tweet text are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const tweet = { username, text: tweetText, date: new Date().toISOString() };
    const key = `tweet:${Date.now()}`;
    const success = await client.set(key, tweet);
    if (success) {
      setTweets([tweet, ...tweets]);
      setTweetText('');
      toast({
        title: 'Success',
        description: 'Tweet posted!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} p={5}>
      <Image src="/images/twitter-banner.png" alt="Twitter Clone Banner" />
      <Box>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input placeholder="What's happening?" value={tweetText} onChange={(e) => setTweetText(e.target.value)} />
        <Button onClick={postTweet} colorScheme="twitter">Tweet</Button>
      </Box>
      <VStack spacing={4}>
        {tweets.map((tweet, index) => (
          <Box key={index} p={4} shadow="md" borderWidth="1px">
            <Text fontWeight="bold">{tweet.username}</Text>
            <Text>{tweet.text}</Text>
            <Text fontSize="xs">{new Date(tweet.date).toLocaleString()}</Text>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default Index;