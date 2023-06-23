SELECT title FROM movies, stars, people, ratings
WHERE movies.id = stars.movie_id
AND movies.id = ratings.movie_id
AND stars.person_id = people.id
AND name = "Chadwick Boseman"
ORDER BY rating DESC LIMIT 5;