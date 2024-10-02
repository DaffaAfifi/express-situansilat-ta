pnpm i joi(validation), express, --save-dev @types/express(auto complete), --save-dev prisma, winston(logger), bcrypt(hashing), --save-dev @types/bcrypt, uuid(unique id), --save-dev @types/uuid, --save-dev jest @types/jest(unit test), --save-dev babel-jest @babel/present-env(for jest bcz type module), --save-dev supertest @types/supertest(unit test express)

setup db -> create model @prisma(prisma/schema.prisma) -> migrate

setup project -> prisma client(src/application/database.js) -> winston logger(src/application/logging.js) -> express(src/application/web.js)

folder structure -> init(src/application) -> logic(src/service) -> handle api(src/controller) -> validation(src/validation) -> routing(src/route) -> response error(src/error) -> middleware(middleware)

create endpoint -> validation -> service -> controller -> route
