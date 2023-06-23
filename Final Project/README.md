# Coffice – a cafe Web App
#### Video Demo:  <https://youtu.be/Gnc4v3Zp9tQ>
#### Description:
<p>
Coffice is a cafe Web App using JavaScript, Python and SQL.
It also uses Flask framework on backend and Bootstrap CSS framework on frontend.
</p>
<p>
In general Coffice app is designed for small cafes located in business or shopping centres.
The main purpose of Coffice is to help a local cafe find and serve as many clients as possible by placing QR-codes in every office of a business centre.
</p>
<p>
Clients see cafe advertisements and use QR-codes to visit cafe’s Coffice web app. There they can see a nicely designed menu and instantly make an order.
</p>
<p>
Coffice offers a convenient basket which allows users to increase or decrease quantity for each item or even delete items from basket.
</p>
<p>
Basket uses browser's localStorage, so that the user which has not finished the order and closed the page could return and complete their order.
</p>
<p>
After the order is made, cafe manager receives the order via Telegram bot and organises its preparation and delivery to a specified office.
Order message contains well structured list of products with prices, total sum, user name, phone, office number and payment type.
If the manager needs to contact the customer they can use the phone number provided in the user data.
</p>
Coffice stores all the information about orders in a database which might be useful for future analysis.
For example it's possible to determine customers with the most quantity of orders, customers who spent the greatest amount of money or the ones who stopped ordering.
Information stored in a database: user name, phone, office number, ip address, order date, products and total sum.
</p>
<p>
Customers provide their contact data when making order, which makes possible contacting them, for example, for service quality evaluation or to inform them about specials or new arrivals.
</p>
<p>
On the backend side the app provides a flexible and secure tool to manage and adjust menu items.
</p>
<p>
When the administrator logs in for the first time, their password will be securely hashed and stored in a database, so the next time they need to log in they will use that password. Administrator is the only user in Coffice system.
</p>
<p>
On the admin panel there are 3 main parts: settings, modifiers and products.
When the administrator successfully logs in, they see the main page of the Admin Panel – Categories. There they can create, edit or delete categories of products, settings and modifiers.
</p>
<p>
Products part is needed to create, delete or update menu categories and items. Settings are global products variations which can be applied to any product specified by the administrator.
Products either allow settings and have multiple prices or they are setting-less and only have one price.
For products with settings customers have to choose a setting, and the setting defines the price.
</p>
<p>
Modifiers are optional additives, they have their own price and range of products they can be applied to. Customer is free to choose whether to apply them or not.
</p>
<h1>Technologies used in this project:</h1>
<p>
– Python 3
</p>
<p>
– Flask Web Framework
</p>
<p>
– SQL
</p>
<p>
– JavaScript
</p>
<p>
– Bootstrap 5
</p>
<p>
– Telegram API
</p>
<p>