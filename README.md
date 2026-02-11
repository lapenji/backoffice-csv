Small backoffice for an ecommerce, built with nestjs and nextjs.

you need node, yarn and docker to run the project

Start the project:

you can build and start the project by renaming env.example in .env both in frontend and backend folder and running yarn build-and-run.

you can find an example csv with some valid and invalid products, the columns must be

name,description,price,discount,discountType

there are some rules:

name is mandatory, price is mandatory and must be greater than 0, discountType can be "amount", "percentage" or "none".

if discountType is none discount must be 0

if discountType is percentage discount must be under 100

if discountType is amount discount must be less than price
