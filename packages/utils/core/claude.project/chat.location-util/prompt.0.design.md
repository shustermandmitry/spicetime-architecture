## prompt 
lets design location util
just the design and api surface
it will have a cli and runtime api
it will provice location object in shape
{
name //package name
path:string //relative path from caller provided location to root of repo
}

the caller will have an option to provide his relative or absolute path
if relative then resolved from package root
____________

### doc [doc.for_prompt_0.design.md](doc.for_prompt_0.design.md)