
If you follow my commits, i dont expect you to
you can clearly see how claude activity shifted towards
webdev domain

and that is a distinct pattern
of behaviour
signifying a change of lifeStage
of process called Creation, designStage
previous stage was ideationStage

but, the line is blured
as i go back and forth, between structures
from mySpicetime/claude to */packages/*/claude
still in claude domain
but in different context, of enclosing domain

and thats the structure of domains, and how they fracture
while maintaining its integrity, of HighClass
but, thats space creation
where objects have consistency
of either pure domain
or granularity of multiple domains within
mixed by mixing composition pattern
Now
is part of a process

and now i will talk of a process of creation
after we figured out the nature of space it creates
and its a long subject, and i covered a lot of it
and this is another iteration
that extends the perspective
connecting to structure we developed above
has to do with life stages as tick constructors
generating ticks, in space nodes, when applied to chunks of space
like that claude folder in a package
and if we tic it by designTic aka designStage
- it creates a chat.vector_design
- creates chat.summary file in chat.vector_ideation
- and feeds it first prompt, with instructions for design stage
    - of a claude project
    - in context of webDev
- then, as second prompt,
    - feeds that ideation summary file as context.from_chat_ideation
        * thats equavalent to chat.vector_ideation, since title is not specified
    - and asks him vector it into imbeddings, and separate easy stuff
      part of design of this package, and hard parts as the roadmap
    - creates chat.vector_roadmap folder
    * feeds it context.from_chat_ideation.vector_roadmap.md as
      context.from_chat_design.vector_roadmap

## though it sounds awfully convoluted and complicated
- its done by one operation of evolve, doing Object.create on
    - its context arg, and all leafs of isInstanceof(Node)=true in it
- on claudeProject node
- ticking each node, as leafs on its branch, an object full of node structures, each is a a chat, or project wide context file
- exact scaffold structure defined by meta.profile_claude_project.(md | json | yml | ts | js | gql | mermaid)
## this has everything to do with how we create categories of related things
however, the trick is - how to create this structure of node types and their meta profiles, and define the logic of time, what happens when it tics, by a stage tic, in each of contexts the node can find itself in

thats not an easy problem
and that, brings me back to reactivity, getter/setter business, and hidden linkages
this is the major source of inspiration, to intuit that kinda of structure

## the meta structure
- its hidden - not in graph db
- but inside getter/setter closures
- inaccessible -  by AI, for we way below level where its usage is allowed
- has to be infered by observing behaviour, orchestrated by
    * reactivity
    * reduxy reducers
- now that i said AI is not allowed - AI services of big external AI models is not allowed in production stage, for purposes of ideation, and design stages
- but we can drop down lifecycle - to those stages,
    * when priorities allow
    * and use those services - till resources allocated to these stages run out
    * for a tic
        * specified by tic resource allocation meta
          meta.vector_resource_allocation file/section of file - leaves in each node meta structure, file or folder of HighClass, but prbly of MiddleClass and LowClass as well, depending where in bootstrapProcess it sits, as its evolution path
            * and that is bootstrapProcess of its parent, on domainTree it belongs to, (i think? pretty positive, but approaching the depth limit. fortunately, thats the end of the road. Thats why three dimensions of space. Im thinking in three axises of some space, which are correlated by trajectory of my flying fancy, a fancySpace? NOOOOO,  fancySpice, just full of it, both fancy and spice, but whats the third axes? ok, im breaking the rule, thats the forth dimention, but, the first three are - spice gotta be spaces, fancy is hidden linkages between all moving parts, third is how to make anything useful out of first two. yep, DomainBuilder component. Thats the trajectory, but thats another day, down the long road, on a big map, but ive just heard, there is an exit)
              !!!!!!!!!!!!!!!!!!!
              Plz note
              what i just did, is started outlining
- not just the process of creation
- but a spec, for one of your game variants, called CreateMe
  back to
## continue meta structure
- so we drop down to design, or even ideation stage
    - of creationProcess
    * the exact structure of spaces, domains and how they are correlated, is a problem with billions of solutions. we will not address it now. But later we will define the exact structure that fits abstraction of reality. all im gonna say, we have the machinery for that, tree, and HighClass utilities.
    - also, we are talking process of creartion of our parent node
    - nodes form spaces, and belong to domains, tree branches
    - its same tree, stemming from fossilSeed of tree util
    - a node constructor can hang as a leaf of just one tree branch
    - it can generate instances, to populate any space, spice rather
    - instances aquire positions, degrees of freedom, when they join a spice
    - theres space, where all node instances belong to
        * space is multi dimentsional - almost infinite dimensional, as mirror of vector space, generated by curating GNN ai, where nodes are imbeddings
        * where spices are 3D+1T
        * space has no notion of time - but it has links indicating cause and effect, expressed in all kinda ways
        * the types of cause/effect one directional links generate domains and spices. How? i dont know yet. you tell me.
- but we missing a bunch of those super important one directional links, in all those state orchestration func closures
- so, whatever process will be generating our domain/spice structure - will need as much help as we can provide those missing links
## how exactly we infer those missing links
- pull all setters/getters out of structure and stick them as reducers, in each entety that has a reduxy architecture. nodes are def belong, perhaps, the only plumbed entity
    * pipelines come with Node constructor, the very first proto
    * also, static middleware funcs are included in the recepi for node instance, at design stage of its bootstrapProcess
    * yep, nodes have process, just one, and one pipe - so much for plumbing
    * but that pipe, and process are composed from its node children instances
    * and those kids can be of different mothers, that live on diferent branches of the domain tree, tree of life, lifeTree. You have to understand, all life is hierarchial. ok, lets drop it.
    * and, i said it before, each leaf on lifeTree is a constructor,/component/class,
    * lets call it a component - can be a compound component or not(familyComponent, or bachelorComponent),
    * and the rest of bushy story is very predictable, on a lifeTree.
    * but not on any spiceTree - that iscomposed out of instances of that bush of a lifeTree.
    * we are heading to jsx strings and spiceTrees they generate, of Node instances

## that should tie it all together
- node instances aqure positions in their spices, jsx strings, that run in local spicetime-react-app
- these are normal css props of positioning
- what those positions represent on a browser page - depends on spice meta
- and that meta forms same exact structure of lifeMetaTree and spiceMetaTrees - the shadows of the visible trees

## but what about looking for missing links?
slow down. at least now, we know why and what we looking for
- so, we got redux machinery
- all getter/setters are roped in to the redux reducer farm
    * we simply extend them - with reduxy boilerplate, and stick them where they came from, into the structure, the spicetime context of each node
        - that spicetime is THE space - that infinite dimensional representation of a graph, the spiceTree, at the node perspective point, limited by his own inherent and not limitations

NOTE
did you get that theres only ONE spiceTree
- all rest of spice jsx trees are branches, with a parent ref, as a parent prop, perhaps removed across the globe

- each node plumbed with redux pipe
    * the parent pipe is composed of children pipes
        - oh yeah, pipe middleware comes from components at design stage, and then at runtime, at production stage, dynamically
        - their composition is orchestrated at design time, using the three patterns of ANY composition, in spicetime, extension, mixings,chaining
    *  but not all middleware is composed into parent pipe - only the api surface
    * same for reducers, including the setter/getters
    * same for the state
    * whioch is all done using the js proto inheritance, and manipulating thru enumeration prop and other mechanisms of access available.
      nothing complicated or brainy, just object manipulations
    * using already composed func pipes, living in same object, down the proto chain.
- and for a punch line
    * we install inference, intuition and inspiration middleware funcs in each pipe, or perhaps aggregate that into highest local scope, along local/remote boundaries in comm layer
    * the intent is to listen to all events flowing thru, and record, for background processing by some high fly AI service
    * but we do all we can do with reps of each functionality, in form of those three middleware stooges
    * now, we stick all that into optimization part of the GNN AI model, local, or conract a gql remote service
    * and we optimize for our main goal - the length of dep connections, between aggregate of all nodes, as we find more and more hidden linkages

and that concludes this sermon, folks