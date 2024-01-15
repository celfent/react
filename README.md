Użyte technologie
Frontend:
- React: biblioteka JavaScript do tworzenia interfejsu użytkownika.
- CSS (z wykorzystaniem Flexbox i Grid): do stylizacji i organizacji układu.
- Axios: biblioteka do komunikacji z serwerem za pomocą żądań HTTP.
Backend:
- Node.js i Express: do tworzenia serwerowej części aplikacji.
- MySQL: relacyjna baza danych do przechowywania informacji o użytkownikach, pracy i komentarzach.
- JWT (JSON Web Tokens): do implementacji uwierzytelniania i autoryzacji użytkowników.

Analiza funkcji projektu "WebBlog".
Rejestracja i uwierzytelnianie. Użytkownicy mają możliwość tworzenia nowych kont za pomocą rejestracji, wprowadzając swoje dane, takie jak imię, zawód, e-mail i hasło. W celu zapewnienia bezpieczeństwa i ochrony prywatności stosuje się uwierzytelnianie za pomocą JWT (JSON Web Tokens). Użytkownicy mogą się uwierzytelniać, używając swojego adresu e-mail i hasła.
Profile użytkowników. Każdy zarejestrowany użytkownik ma swój własny profil, gdzie może przeglądać swoje informacje (imię, zawód itp.).
Strona portfolio. Każdy użytkownik może dodawać swoje kreatywne prace na stronę, umożliwiając publiczne prezentowanie swojego portfolio. Dla każdej pracy można podać tytuł, opis, datę wykonania i link do odpowiedniego zasobu (GitHub). Istnieje również możliwość usuwania postów.
Kontakt z autorem. Istnieje wbudowane narzędzie do kontaktowania się użytkowników z autorem projektu. Użytkownicy mogą wysyłać wiadomości za pośrednictwem strony, integrując REST API do wysyłania e-maili na adres Gmail autora.
Użytkownicy mogą również dodawać komentarze, dyskutować i wyrażać swoje opinie na temat portfolio.
