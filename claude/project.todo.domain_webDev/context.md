

## this is a description of workflow
well have to start splitting  into modules, each with its own test

tests and modules,with doc extention, will be in same folder as the script

we will write our tests first, then update docs in the design chat

and thats a general pattern,  prelim design first

prelim tests, evolve tests to finals, generate final design docs,

implement and pass the tests, repeat for any new insights,

## im talking about vector files, 
but prefered pattern is to use webstorm and record thoughts in appropriate chats under context or prompt
files, for future processing, so not to get distracted
however, the file structure and naming convention im describing is
a valid pattern, tyhough a bad practice if persistent
to make it not persistent, and help overwhelmed web dev, the runtime should
pick up this files, if not it the proper way, right after vectorize the prompts
in real time


below is 0.vector_webDev-fs - for a spec on fs language of web dev projects

adding patches of tests and docs, as updates/patches to vectors test and design and implementation

each patch should have add/delete/update commands, for specific functionalities or tests or some other granules, in ciontext. then a [moduleName].snapshot.vector.test.ts will create final test, while [moduleName].1.1.vector_test.ts indicates first patch to prelim test

once it vector_test is attached to vector 1, it can be refered to by just number, as [moduleName].3.1.ts

we are covering several vectors here, btw,webDev-fs,webDev-workflow,test,design

we will have implementation and debug as well, later

these are key vectors in webDev domain


## we should have a progression of modules

evolve.2.snapshot.ts is aggregate of patches upto and including tic 2

some utility/runtime will be updating evolve.ts, so importing works

ts and vite and vitest will have to ignore all weird extensions

same goes for all webdev stage vectors, test,design,debug,implement and maybe prod

i know theres a git branch workflow to keepmtrack of stages, but this way we can blend,  and do organic phase changes, murging to prod only when every file has a prod stage ,as example

back to vector_test vector_design

## profile
that specifyes key files and key words used in file extensions
and the spec of the interpreter and instructions to runtime logic

## note
that runtime has its own build stage, and when it runs, its prod stage for it
so, as a component, in the future, it will be a compound component, enveloping the whole web dev environment, and coordinating with webstorm and using utils

## on beginnings of runtime interpreter
im talking of each branch on a tree having a translator, termTransform,aliases object that relates terms to its parent, and overloads its terms with its parent interpretation
and even its own nicknames, creating variants of its own lingo
soon enough, it will become too complicated for a simple object, and evolve into a tree, derrived at from spoken or written spec, or written in a domainDefinition
lingo, the seed of all lingos in babylone of spicetime

so, aliases are very useful

now we have a way to relate kids to parents, and end generation gap issues

eventually, itll get overloaded up into a rust implemented zoo of interpreters, complete with run times, creating domain specific  syntactic lingos

that will give us ability to create executable trees, and be generative to spoken words