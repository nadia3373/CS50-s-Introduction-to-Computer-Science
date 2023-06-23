SELECT name from movies, stars, people
WHERE movies.id = stars.movie_id
AND stars.person_id = people.id
AND title = "Toy Story";