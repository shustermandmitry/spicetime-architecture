## prompt 10
now we have to connect our process tree to other process domains and their pallets of components/action trees
- so, at api level,like in any well behaved package folder, there is a package.json type of structure
with declared deps,of any kinda tools, including other process packages
- that comes with process constructor, but there are actions that allow mutations, at api stage
- and constructor uses those actions to install the deps, exposing their api by dumping what they expose in 
their executable schema right into itself, swallows them wholesale
- if there are any name clashes, it creates an alias dictionary, and puts a pre-suffix in to resolve, unless
package supplies some other alias, in its api. perhaps a query , standard to all apis, 
- we can have a query to expose pallet of components, or even merge process trees, and stages.
or, rather have an action that takes another process tree and merges it with current, and another that takes it off
- so it maintains a profile on each, and knows how to separate them
- the advantage, we get to compose processe and preserve sane syntax, wo huge paths in our scripts, for each name. 
That would be aweful syntax. And would wreck havoc with our elegant design of scoped stages
- no, there are different ways to compose processes, for thats what we doing. we cant just borroug some components
from another process. we have to swallow all of its state logic along with shape of the state, and reducers. 
thats called composing processes
- and that means theres no process domains. a process domain is just a composed process. and yes, processes have profiles.
some scaffolding template, so we can instantiate them by just extending structure. thats what these hirerachial objects are.
trees, structure, so we can just use ramda funcs that manipulate objects, and then back into scope representation.
just follow proto chain
- and that simplifies our composition patterns . We know how to compose objects/structurte.
we can extend structure, by just doing extend(a,b), or we can do object.create(a,b), 
or  mixin(pick(a,[...]),pick(b,[...])).
- never mind converting objects to objects. that was dumb. they are already objects, just do it straight on the process object, the ops i outlined
- but we lose stage structure, thoug the logic is preserved. actions know what stage they are, 
and do change of stage automatically , but we can be more careful while extending and mixing, and combine namesake stages.
but thats a can of warms. how do we know they have the same intent. so, its better to go simple. 
- but issue is resolved by that scaffolding profile, that spells out what branch each action monkey belongs to,
stage, actually, for we dont really care, except that logic is preserved. but new profile needs to be created,
again,l by doing similar composition op on scaffold profile. but then, who needs scaffold, when it can be aggregated by just crawling the tree.
just forget it profiles. keep it simple. well have a getScaffold func and be done
- i backtrack a bit. we do need to convert process object, that is not stage aware, into a stage tree, depicting the exact 
stage structure, and allow users to oprecisely design how processes merge, by some reacty page, eventually, but for now just 
have funcs that convert back and forth, and and forth means actually composing processes as prescribed by the merged structure
so, its two different domains that conform by some symmetrical transform
- but we can have murger profiles, as simple is just dump one process into the top layer of another, or murge 
whatever matches names, and throw the rest to the top, or to the bottom, a param of the profile
- and we can have process types that have composition relationship, and merge by some predefined way, determined by that link, 
maybe a several ways to do it. but thats for later, a roadmap item. mannualy is just fine for now
- manually means, we are offered a func, as a tool, provided by createProject, that allows this arrangements, with appropriate
functional tools to do the job in good syntax
- but in the future, this compositions will be done thru jsx strings, one per each stage, and another composing stages 
- and thats how our createProcess should work, allow composing each stage at a time, by its own func, and ability to create new stages,
the reducers and state will simply line up in lockstep, as actions and state they operate on are a composable unit

## answer
You're right - I got carried away. Let's restart with a clear structure.

You asked for:
1. An overview document
2. Six detailed specification documents:
    - Process Lifecycle
    - Layered Architecture
    - Domain Composition
    - Tree Structure
    - Stage Operations
    - Runtime Model

Let me create a fresh overview that integrates Redux pipelines as a core concept, and then we can systematically develop each specification document.

Would you like me to:
1. Create the new overview first, incorporating pipelines as a fundamental concept?
2. Or would you prefer to refine the document structure further before proceeding?

## prompt 11
let me explain how process language is interpreted and structured
process exposes action funcs and its state as simply props of its own object, layered in proto 
structure of a normal js object
its just normal english
there are verbs that do what they say and nowns that are state elements, and we can form syntacticaly meaningful sentences
using just functional english as available in our reducer dictionary. 
but that language is composed thru many layers of some progenitor of the domain that layered up the language, with prbly many
linguistic stages. and composed from differnt dialects and there are all kinda composed chains that define whole concepts
like exact descriptions in fp, using entire fp arsenal, to spell good english
and thats what any process is basing off
then it adds reducers of its own flavor, but also syntactically meaningful
if we too lazy to spell an action in a long func chain, we just dump it all into a long func and give it some descriptive name
like doMyfavoriteThing
then thru pipelines, the exact meaning of these lingustic terms can be modified, flavored
that will allow ai to do linguistic analysis of basical
ly code of a process, and will create domain specific lingos, composable

## answer
Ah! Now I understand - this is a much deeper insight about how the process forms a linguistic model through its layered properties. Let me write a fresh spec that captures this language-oriented view.

[doc.11.0.add_process-language.md](doc.11.0.add_process-language.md)


This views process as a linguistic model where:
1. The object naturally forms vocabulary (verbs/nouns as props)
2. The proto chain layers dialect evolution
3. FP helps compose meaningful sentences
4. Actions can be simple verbs or complex expressions
5. AI can work with the linguistic structure

Is this closer to your vision of how process forms a natural language through its layered properties? Let me know if you'd like me to:
1. Expand any part of this linguistic model
2. Show more examples of language composition
3. Explore how AI could work with this structure

## prompt 12
we start lingo composition with just ramda or some other fp lib and start building efficient tools of linguistic composition, following grammar of the langauge, 
and layering our interpreter process as we are bootstrapping the syntax, to avoid circular definitions
and we compose different linguistic structures as processes, cos languages are procedural
they describe actions and plans. its al;l about processes and receipes of actions
we simply put a linguist hat on for a while, or let you do it.
you can give a small exampl;e, buty well design it all later, when we need it
perhaps there are opackages that already doing that

dont do do, it makes no linguistic sense

i dont say do doProcessItem

i say process item [name, which is state el]

and item func takes that name and gives to process and its a chain

## answer 
Ah! Now I really understand - you're talking about using commas to create hierarchical composition that reads even more naturally.



Does this better capture what you mean about using commas to create linguistic patterns? I can look into existing packages 
that might support this kind of hierarchical composition.