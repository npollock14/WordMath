# Word Math

This demonstration allows you to explore relationships between words using vector embeddings! You can apply math operations (+ and -) on the semantic meaning of words.

Vector embeddings were generated using ada-002 model from OpenAI or the word2vec-google-news-300 pretrained vectors.

## How to use

The most common examples are of the following form:

```
word1 - word2 + word3 = word4
```

For example:
    
```
king - man + woman = queen
```

This closely resembles the template for an `analogy`. In this case it will be of the form:

```
word2 is to word1 as word3 is to word4
```

In the example above, `man` is to `king` as `woman` is to `queen`.

## How it works

At its core, word vector embeddings are a way to represent words in a high-dimensional space where semantically similar words are located near each other. When we talk about word math, we're essentially moving around in this space using vector arithmetic to reveal meaningful relationships between words.

Here's a step-by-step breakdown:

1. **Embedding Words**: Each word in the vocabulary is represented as a high-dimensional vector, usually with hundreds or even thousands of dimensions. These vectors try to encapsulate a lot about the word's meaning based on its usage in various contexts. Different models may encode different aspects of a word's meaning based on the data that model was trained on.

2. **Vector Arithmetic**: Arithmetic operations may be applied to these word vectors, allowing us to effectively operate, on the semantic meaning of the words. These operations can uncover interesting relationships and analogies between words.

<!-- 3. **Visualizing the Arithmetic**: 

![](https://miro.medium.com/v2/resize:fit:640/format:webp/1*dm9dudL37B6JG8saeR3zIw.png) (credit to [medium](https://medium.com/arvind-internet/applying-word2vec-on-our-catalog-data-2d74dfee419d))

 It showcases a parallelogram formed using vectors of the words `king`, `queen`, `man`, and `woman`. The vector connecting `king` and `man` represents the semantic difference between those two words. Similarly, the vector connecting `queen` and `woman` captures the semantic difference between them. The hypothesis is that these differences (or semantic vectors) are roughly parallel in the vector space, hence forming a parallelogram. In this example, "royal" can be considered as the connecting semantic vector, showing the shift from a general gender term to a royal counterpart. -->

3. **Finding Analogies**: Once the arithmetic is done, the resulting vector is searched for in the vector space to find the closest matching word or words. For instance, in the equation `king - man + woman`, we're essentially asking: "What is the word that is related to `woman` in the same way `king` is related to `man`?" The answer, as the vector space reveals, is `queen`.

4. **Sources of Vectors**: The quality and accuracy of these relationships largely depend on how the vectors were trained. The mentioned vectors, `ada-002` from OpenAI and `word2vec-google-news-300`, have been trained on vast amounts of text, enabling them to capture intricate semantic relationships between a large set of words. `ada-002` has 1536 dimensional vectors, while `word2vec-google-news-300` has 300 dimensional vectors.

This process doesn't always result in perfect analogies, but it's a fascinating way to explore the relationships and nuances of language as captured by modern machine learning models.

## Example List

- king - man + woman = queen
- japan - sushi + pizza = italy
- airplane - air + road = automobile
