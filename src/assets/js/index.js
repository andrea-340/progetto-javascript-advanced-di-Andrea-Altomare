import "/src/css/stile.css";
alert(
  "AVVISO IMPORTANTE:se clicchi sul libro desiderato, avrai le info del libro"
);
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("button");
  const resultDiv = document.getElementById("resultDiv");
  const inputElement = document.getElementById("inputField");

  const performSearch = async () => {
    const inputText = inputElement.value.trim();
    resultDiv.textContent = "Caricamento...";

    if (!inputText) {
      resultDiv.textContent = "Per favore inserisci una categoria.";
      return;
    }

    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/${inputText}.json`
      );
      if (!response.ok) {
        throw new Error(`Errore nella fetch! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.works || data.works.length === 0) {
        resultDiv.textContent = "Nessun libro trovato in questa categoria.";
        return;
      }

      resultDiv.innerHTML = "";
      data.works.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book-item");
        bookItem.innerHTML = `
          <h3>${book.title}</h3>
          <p>Autore: ${
            book.authors
              ? book.authors
                  .map((author) => author.name || "Autore sconosciuto")
                  .join(", ")
              : "N/A"
          }</p>
          <img src="https://covers.openlibrary.org/b/id/${
            book.cover_id
          }-M.jpg" alt="Copertura" />
        `;
        bookItem.addEventListener("click", async () => {
          const bookDetails = await getBookDetails(book.key);
          showBookDetailsAlert(bookDetails);
        });
        resultDiv.appendChild(bookItem);
      });
    } catch (error) {
      resultDiv.textContent = `Errore: ${error.message}`;
    }
  };

  // Aggiungi l'evento click al bottone
  button.addEventListener("click", performSearch);

  // Aggiungi l'evento keydown all'input per catturare il tasto Enter
  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Previene l'invio del form
      performSearch();
    }
  });

  // Funzione per ottenere i dettagli del libro
  async function getBookDetails(bookKey) {
    if (!bookKey) {
      throw new Error("bookKey non valido");
    }
    const url = `https://openlibrary.org${bookKey}.json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Errore nella fetch dei dettagli! Status: ${response.status}`
      );
    }

    const bookDetails = await response.json();
    return bookDetails;
  }

  // Funzione per mostrare i dettagli del libro in un alert
  function showBookDetailsAlert(bookDetails) {
    const title = bookDetails.title || "Titolo non disponibile";

    // Gestione autori
    const authors =
      bookDetails.authors && bookDetails.authors.length > 0
        ? bookDetails.authors
            .map((author) => author.name || "Autore sconosciuto")
            .join(", ")
        : "Autore non disponibile";

    // Gestione descrizione
    const description = bookDetails.description
      ? typeof bookDetails.description === "string"
        ? bookDetails.description
        : bookDetails.description.value
      : "Descrizione non disponibile";

    // Gestione data di pubblicazione
    let publishDate = "Data di pubblicazione non disponibile";
    if (bookDetails.publish_date) {
      if (Array.isArray(bookDetails.publish_date)) {
        publishDate = bookDetails.publish_date.join(", ");
      } else if (typeof bookDetails.publish_date === "string") {
        publishDate = bookDetails.publish_date; // Se la data è una stringa
      }
    }

    alert(`
    Titolo: ${title}
    Descrizione: ${description}
  `);
  }
});
