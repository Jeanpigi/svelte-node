<script>
  import { slide } from "svelte/transition";

  export let book;
  export let removeBook;
</script>

<style>
  .book {
    margin-top: 20px;
  }
</style>

<div class="book notification is-light" transition:slide={{ duration: 500 }}>
  <h1>Author:</h1>
  <span>{book.author}</span>
  <h1>Book:</h1>
  <span>{book.book}</span>
  <button class="delete" on:click={() => removeBook(book.id)} />
</div>
