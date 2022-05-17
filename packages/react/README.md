# common-react

NPM page: https://www.npmjs.com/package/@joker7t/common-react

## Installation:

Using Yarn
> yarn add @joker7t/common-react

Using NPM
>npm i @joker7t/common-react

## Features:
### Hooks
- **useQuery**
  - The useQuery hook id the best used for loading some data from an API that need to be used right away in the react component.
  - For example, loading a list of items that need to be displayed.
  - The hook is reactive and will automatically reload data from the API if the request parameters change.
  ```typescript
  const { data, loading, error, refetch } = useQuery(client.example.getExample, {
      paramters: {
          // ...
      }
  }) 
  ```
- **useQueryLazy**
  - The useQueryLazy is a lazy version of useQuery; meaning it will only fetch data from the API when you call the `load()` method.
  - The useQueryLazy hook is the best used when some data needs to be loaded and displayed after some user actions, for example the user clicks a "show details" button.
  ```typescript
    const [load, { data, loading, error, called, reset }] = useQueryLazy(client.example.getExample, {
    // The request object can be passed to the hook itseft 
    // or as an argument when calling `load(request)`    
    paramters: {
            // ...
        }
    }) 
  ```
- **useMutation**
  - the useMutation hook is designed for calling API that mutate data i.e. POST/PUT/PATCH/DELETE.
  - the hook provides a `mutate()` function that accepts the API request object returning an API response.
  - this hook can be used to implement form submission handlers to POST data to the API.
  ```typescript
    const [mutate, { data, loading, error, called, reset }] = useMutation(client.example.getExample); 
  ```

## **Versions:**
You can check all the versions [here](https://github.com/joker7t/common-utils#common-react).
