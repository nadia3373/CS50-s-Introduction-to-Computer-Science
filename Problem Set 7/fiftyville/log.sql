-- Check crime reports for 28.07.2021
SELECT * FROM crime_scene_reports WHERE year = "2021" AND month = "7" AND day = "28" AND street = "Humphrey Street";

-- Check interviews from witnesses for that day
SELECT * FROM interviews WHERE year = "2021" AND month = "7" AND day = "28";

-- Check who of the bakery visitors withdrew money that day
SELECT * FROM people, bank_accounts, atm_transactions WHERE bank_accounts.person_id = people.id AND atm_transactions.account_number = bank_accounts.account_number AND person_id IN (SELECT person_id FROM bank_accounts WHERE account_number IN (SELECT account_number FROM bank_accounts WHERE license_plate IN (SELECT license_plate FROM bakery_security_logs WHERE year = "2021" AND month = "7" AND day = "28" AND hour = "10" AND minute > 15 AND minute < 25))) AND atm_location = "Leggett Street" AND transaction_type = "withdraw" AND year = "2021" AND month = "7" AND day = "28";

-- Check who of the suspects took the earliest flight out of Fiftyville
SELECT name FROM people WHERE passport_number = (SELECT passport_number FROM passengers WHERE passport_number IN (SELECT passport_number FROM people WHERE phone_number IN (SELECT caller FROM phone_calls WHERE caller IN (SELECT caller FROM phone_calls WHERE year = "2021" AND month = "7" AND day = "28" AND caller IN (SELECT phone_number FROM people, bank_accounts, atm_transactions WHERE bank_accounts.person_id = people.id AND atm_transactions.account_number = bank_accounts.account_number AND person_id IN (SELECT person_id FROM bank_accounts WHERE account_number IN (SELECT account_number FROM bank_accounts WHERE license_plate IN (SELECT license_plate FROM bakery_security_logs WHERE year = "2021" AND month = "7" AND day = "28" AND hour = "10" AND minute > 15 AND minute < 25))) AND atm_location = "Leggett Street" AND transaction_type = "withdraw" AND year = "2021" AND month = "7" AND day = "28")) AND year = "2021" AND month = "7" AND day = "28")) AND flight_id IN (SELECT flights.id FROM flights, airports WHERE year = "2021" AND month = "7" AND day = "29" AND origin_airport_id IN (SELECT origin_airport_id WHERE airports.city = "Fiftyville") ORDER BY hour LIMIT 1));

-- Check whom the suspect called
SELECT name FROM people WHERE phone_number = (SELECT receiver FROM phone_calls WHERE caller = (SELECT phone_number FROM people WHERE passport_number = (SELECT passport_number FROM passengers WHERE passport_number IN (SELECT passport_number FROM people WHERE phone_number IN (SELECT caller FROM phone_calls WHERE caller IN (SELECT caller FROM phone_calls WHERE year = "2021" AND month = "7" AND day = "28" AND caller IN (SELECT phone_number FROM people, bank_accounts, atm_transactions WHERE bank_accounts.person_id = people.id AND atm_transactions.account_number = bank_accounts.account_number AND person_id IN (SELECT person_id FROM bank_accounts WHERE account_number IN (SELECT account_number FROM bank_accounts WHERE license_plate IN (SELECT license_plate FROM bakery_security_logs WHERE year = "2021" AND month = "7" AND day = "28" AND hour = "10" AND minute > 15 AND minute < 25))) AND atm_location = "Leggett Street" AND transaction_type = "withdraw" AND year = "2021" AND month = "7" AND day = "28")) AND year = "2021" AND month = "7" AND day = "28")) AND flight_id IN (SELECT flights.id FROM flights, airports WHERE year = "2021" AND month = "7" AND day = "29" AND origin_airport_id IN (SELECT origin_airport_id WHERE airports.city = "Fiftyville") ORDER BY hour LIMIT 1))) AND year = "2021" AND month = "7" AND day = "28" AND duration < 60);