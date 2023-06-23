SELECT DISTINCT title FROM movies, stars, people
WHERE stars.person_id = people.id
AND movies.id = stars.movie_id
AND movies.id IN (SELECT movie_id FROM stars WHERE person_id = (SELECT id FROM people WHERE name = "Johnny Depp"))
AND movies.id IN (SELECT movie_id FROM stars WHERE person_id = (SELECT id FROM people WHERE name = "Helena Bonham Carter"));