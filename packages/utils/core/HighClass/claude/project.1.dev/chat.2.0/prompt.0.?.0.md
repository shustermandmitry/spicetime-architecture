## patch 0
- i want to structure along my own experiences with english
- languages dont have objects imbedded into dictionaries. you building fix classes
- i did not say to do that
- i said put it all into HighClass class - we just have a pile of words, and they might have different meaning in contexts
- well, we supplying context and we can condition on that, and mirror english, and theres no need for 
complexity of branching subcategories.
well might have branching, as pointers to our children, as they extend the class, but
its up to other extensions, we not providing it out of this package
- so, keep structure flat - if any name clashes, we create aliases as i described in that convo with kostya. 
- yes, i do want alias functionality, as alias helper func, and we have to align its usage along lexical lines,
so it can be used in func pipes. just make it a decorator. we dont use aliase as a common word. its a thing we keep in mind,
so tuck it away into class closuer, with a decorator, but put it into vocabulary, when alias decorator is created, by
alias method, a method of a first or second extension layer
- what we need is to build a vocabulary, and be very careful describing it
  - this isthe api surface
- if we not exposing a func as api, it has to be enumerable
- as i said, words can change meaning due to context, as some state props change. so, we use getters for that
but only when needed.
- so, we need a way to update vocabulary, meaning sticking a word/prop into high class instance

## usage of HighClass defines its structure
- yes, we will instantiate classes to create executable languages and other things, whatever use case might be -
  - but mechanics , and syntax of that mechanics as tree-util syntax, is generic, and will be used in other domains
  such as executable linguistics, which i tend to call reflex, with a render method, that executes composed sentences, 
  fp pipes
  
- HighClass is just a class with built in fp compositional actions, that streamlined as lexical, thru naming
    * each instance is a leaf of that branch
    * then leafs can sprout new branches, HighClass extensions, extending their constructor class
    * that syntax, of branching, will be supplied by another core util package called tree-util, exposing tree constructor
      * that tree constructor is not a class, but a func, that uses object.create 
      * tree-util does not depend on HighClass, but HighClass does depend on tree-util
      * so, to streamline syntax, and architecture, we are building a class tree, in a classless society ;)
      * from a fossilSeed - provided by tree-util, with value passed as vanilla js class
      *  then, we start extending that - by branching
      * the leafs of each branch - are extensions of a class, being worked on, in this particular tic of time
      * but HighCl;ass is timeless - it has no notion what tics or tim, that creates them, is
        * that comes as extension, branch, into another domain, called spicetime
      *  tic, in this context - is manipulations and process of creation in a package, that uses its parent branch/package
      as its dep
      *  its not THE only dep it has, internal to monorepo, but def one of them, as ref to its parent
      *  in addition, each leaf can branch
- so, we need a method to stick a context aware state var,prop, nown, into instance. that actually means reactivity, and
breakes redux pattern, and not being declarative. but thats how languages work. no one announces that today dog will mean trump.
and i guess thats ok, as long as we following natural english patterns, but in base version we cant control that.
letm just do what they want, for now. so, if they use getter installer, they get to define its logic
thats actually nice, minimizes complexity of state management, relying on common knowledge. that is efficient.
- so much for reactivity. it hides the deps and logic in closuers, not very declarative