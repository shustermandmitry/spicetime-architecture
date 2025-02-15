## we will be using best fp practices
where it makes sense
obviously, we can not create immutable copies of entire distributed universe, or even local perspective
or any part of it, for its unscalable
that part we live in place
however, we only extend it

## so, when do we extend in place, and when make a copy
thats a time issue
between tics, we extend any structure
when the clock strikes, and we in another tic, no other tic is mutable
but we can link to it

## implications
we can not copy any structure out of its context
a number of links will get broken, and lots of context lost, at destination
- so, whats the solution?
there can be several
  1. copy it, and let new owner send queries
  hell save money on initial query, but might lose on additional queries
  2. process it locally, and fill in missing context, perhaps summaries of missing links
  for it might be a huge volume in one link
- universal solution to links problem
we make an extended copy, with proto ref, fill in whatever else is requested, or needed as extender.
this preserves the lineage with all info, and lets us out of storage bind.
its js solution