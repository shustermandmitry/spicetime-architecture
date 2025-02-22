but those pipes, are what will create processes, cos all funcs are stateful
funcs dont mutate state, but self, only the local structure, and only while tic is in current state, notion of now, once tic is done, its immutable, and only an object.create can be done on it
so, each func does object.create on self, and hacks on that object
then, it seals it, and thats a tic
at each func in the pipe
thats transaction, the totality of all linked tics thru distributed space
once transaction is done, tic, for all nodes involved
the depth of transaction is limited by synchronization of state between nodes and funcs
otherwise, a transaction would last lifetime of universe
and thats why theres notion of causality and sequence of events
all observers in a connected space will agree on sequence of all observable events. Thay all synched, by design

## Node life stages
each Node component has an object with a list of its life stages, by name
each life stage is an object of actions can be performed at that life stage, each is a pure func
in short, its a set of reducers, structured by life stages

## we using react reducer hooks 
components are organized as compounds, each with its system of reducers, aggregated thru jsx structure of its children
so, reducers are technically in a flat structure, at run time
but we organize them declaratively by life stages
they are freed from the boilerplate of watching for life stage switches in the state
thats just implementation detail, for syntax sugar
there might be other sugar coatings, and it is all orchestrated by composing funcs in pipelines, as part of process orchestration
which is unclear at this point

## on pipeline structure
- as a part of redux style state orchestration, we will have pipelines wherever reducers are aggregated, at parent components
  - however, there are pipelines at each child component as well
  these are strictly component wise, not jsx element specific
  they have to do with customizing behaviour of components. 
    - Just another way to extend components
    - usage - primarily for the benefit of syntax sugar, like fixing the problematic behaviour of js classes 
    - they do not modify a component in place, but create a new one. Component is a component, not a chair, that changes into
    fence post, when you sit on it
- in addition to those, parent components will have consumer installed pipeline middleware
  - and itll be dynamic, but subject to allowed life stage actions, conditioned by state  
  - again, same pattern persists
    1.as each parent component can be a child of another, it will have its own pipeline, installed at build stage.
  and it wiil allow installation of middleware at run stage, but they will be lifted to higher scope parent component
  
## pipeline structure finalized
- each component will have 
    1. build stage pipe - installing a batch of middleware in build stage pipe, at design time, creates an extended component, with all scopes evolved,
  as normal
    2. the LIMITATION of build stage middleware - it can not change component API. Its strictly internal fix for syntax sugar, or internal restructuring.
  This allows introspection on dynamic level.and it fits pattern we find in reality. An individual seeking personal evolution, goes to the monastry in the forrest, not to a piublic forum, 
  to convince everyone to go to build stage, just cos he cant find his lunch
     2. run stage pipe - this is dynamic middleware, similar to redux pipeline. Im not sure if that is commonly done, buyt i dont see why not and 
  what the harm. iot will allow for some interesting dynamic behaviour, but exact implementation will be decided as use cases emerge. perhaps, an extra life stage
  will be required
    3. all runtime middleware is lifted to higher parent - untill top level of react app is reached, and that is technically redux pattern, except tyhe build pipe
  
## aggregation of reducers and events/actions, and state
- same pattern as for middleware - build stage elements will live locally, and orchestrate state management between internal modules , as nothing is build from scratch,
- except the core utils - that create those functionalities we are describing
- but each module has a defined api surface, and its own volume of concern, and might not even be aware of redux,react and some crazy reducers
- the rest of floatsome goes straigh to the top, of the top level component, local instance of spicetime-react-app
- where distributed comm layer takes over
- and thats the backbone of messaging system

## implications
- instances of components can dynamically change their minor version, basically self mod themselves, wo casing any issues
the new component will leave locally, and can be broadcast over component market, if desired
- structure of stae, and reducers and actions will adjust dynamically, and organically with dynamic changes of the jsx string
  


