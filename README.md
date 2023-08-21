# Inspiration

We had a tough time getting help for our homework, assignments, and projects in school, which left us feeling stressed and stuck. So, we came up with Skilify, a platform created by students, for students. Skilify is our way of fixing this problem. It's a place where students can help each other out. You know, sharing ideas, giving solutions, and providing guidance – all the stuff we wish we had when we were struggling. It's not just about getting answers; it's about building skills and boosting confidence. With Skilify, students can tackle their academic challenges with more know-how and a can-do attitude. It's like having a supportive study buddy available whenever you need it.

# What it does

Skilify is a platform for students to exchange network, exchange skills, and tutor. A student who's strong suit is math could need help peer reviewing their essay, and in exchange for their math skills, someone else who needs math tutoring could help them out in writing. Skilify makes it easy for students to find others to exchange skills with and tutor, efficiently and at no cost.

# How we built it

- [Next.js](https://nextjs.org/) - Framework, Frontend & Backend
- [shadcn-ui](https://ui.shadcn.com/) - Modern UI Component Library
- [next-auth](https://next-auth.js.org/) - User Authentication
- [Firebase Firestore](https://firebase.google.com/) - User Database (Authentication, User Data, Questions)
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [TypeScript](https://typescriptlang.org/) - Typed JavaScript (Programming Language)
- [Visual Studio Code](https://code.visualstudio.com/) - Primary IDE
- [Github](https://github.com/) - Version Control & Collaboration
- [Vercel](https://vercel.app/) - Deployment

# Challenges

- Storing user data alongside next-auth - no documentation (should data be stored separately? In the same database?)
- Paginating data - useSWRInfinite wasn't documented well, and had some issues in implementation
- Securing authentication from bad actors
- Learning completely new framework and database systems
- Merging conflicted files, due to a change in formatting between different developers (different formatting led to numerous conflicts)
- Getting the authenticated user's id - ~~next-auth likely doesn't endorse this use-case, and we had to write our own component & API route to retrieve the user's id~~ See below "What we learned".
- Properly attaining user data
- Protecting routes from bad actors and spam - we found out it was possible to spam create buttons, and overload the database and API (we had to upgrade to the Firebase Blaze plan..)

# Accomplishments

- Working project that looks clean and modern
- Easy to use for end users (Majority of Hackathon time)
- Proper and secure authentication

# What we learned

- Using NextJS' app router and src folder
- Creating APIs using NextJS
- Storing documents in Firebase Firestore
- Implementing secure authentication and user data with next-auth
- React states, context and components
- next-auth has ways to modify the user object it returns - no need to guess the userid based on the email and name! Big oversight, knowing this could have saved a lot of time and staying within Firebase's free tier.

# What's next

- Continue refining UX
- Authenticate and confidently identify accounts to protect users
- In House Networking System (Chat, Calling, etc...)
- Moderation System to keep platform friendly
- View questions and answers from users
- Better reputation system
