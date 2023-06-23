SELECT DISTINCT name FROM movies, directors, people, ratings
WHERE movies.id = directors.movie_id
AND movies.id = ratings.movie_id
AND directors.person_id = people.id
AND rating >= 9;