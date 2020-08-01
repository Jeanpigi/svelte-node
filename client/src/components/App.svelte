<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Loading from "./Loading.svelte";
  import Book from "./Book.svelte";

  let book = "";
  let author = "";
  let books = [];
  let loading = false;

  onMount(async () => {
    loading = true;
    const { data } = await axios.get("/api/books");
    books = data;
    loading = false;
  });

  const addBook = async () => {
    const libro = {
      book: book,
      author: author,
    };

    const response = await axios.post("/api/books", libro);
    books = [response.data, ...books];
    book = "";
    author = "";
  };

  const removeBook = async (id) => {
    const response = await axios.delete(`/api/books/${id}`);
    if (response.data.id === id) {
      books = books.filter((t) => t._id !== id);
    }
  };
</script>

<style>
  .app {
    margin: 40px auto;
    max-width: 500px;
  }
</style>

<div class="app container">
  <div class="field">
    <label class="label">Author</label>
    <div class="control">
      <input
        class="input"
        type="text"
        bind:value={author}
        placeholder="e.g Alex Smith" />
    </div>
  </div>

  <div class="field">
    <label class="label">Book</label>
    <div class="control">
      <input
        class="input"
        type="text"
        bind:value={book}
        placeholder="e.g Programación en Javascript" />
    </div>
  </div>

  <div class="control">
    <button class="button is-primary" on:click|preventDefault={addBook}>
      Save
    </button>
  </div>

  {#if loading}
    <Loading />
  {/if}

  {#if !books}
    <div class="notification">Add your first book</div>
  {:else}
    {#each books as book (book.id)}
      <Book {book} {removeBook} />
    {/each}
  {/if}

</div>
