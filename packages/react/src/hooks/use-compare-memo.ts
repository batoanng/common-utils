import { useRef } from 'react';
import { isEqual } from 'lodash';

/**
 * useCompareMemo memorizes the given value and only returns a new reference when the structure-base-equality
 * changes between hooks renders.
 *
 * why?
 *
 * consider hooks component that renders a hook like so:
 *
 * ```
 * function MyComponent(props) {
 *     const { data } = useQuery(client.getExample, {
 *        parameters: { id: props.id }
 *     });
 *
 *     return <div>...</div>
 * }
 * ```
 *
 * the component is expecting to query an API with a given id received via the component's props object,
 * and it does this using the useQuery hook by passing in a request object as the second parameter.
 *
 * there's a subtlety about this example that useCompareMemo solves for us.
 *
 * in the example code the request object passed to useQuery will a brand new object each time the component re-renders.
 * event if the `props.id` doesn't change.
 *
 * the object is structurally the same if the `props.id` hasn't changed, but it is still a brand new object
 * i.e. a new object in momory, i.e. a new object reference.
 *
 * we know this because we're creating a new anonymous object as the second argument to useQuery`{}`.
 *
 * this presents a challenge to useQuery because it wants to be clever and query the API if the request object changes.
 *
 * useQuery wants to do something like this:
 *
 * ```
 * function useQuery(method, request){
 *     useEffect(() => {
 *         // do the api call and update state
 *     }, [request]); // run the effect when the request changes
 * }
 * ```
 *
 * the useQuery hook wants to run an effect when an argument changes, so we add the argument to the hooks deps array.
 *
 * but here is the subtlety: hooks hook deps work on reference equality for objects.
 *
 * so each time MyComponent re-renders, it will pass a new object to useQuery and useQuery's effect will run again
 * causing an infinity API call loop.
 *
 * so useCompareMemo exists to solve this problem by acting as a reference cache.
 *
 * useCompareMemo accepts an input reference and caches it between hooks renders. if the input references change
 * between re-renders useCompareMemo will use lodash.Equal to determine if the new reference points to something
 * that's structurally equal and if so, will return the cached reference.
 *
 * this means useQuery can be updated to ignore new request objects that are structurally equivalent between re-renders.
 *
 * ```
 * function useQuery(method, request){
 *     // memoize the request reference based on structural equality
 *     request = useCompareMemo(request);
 *
 *     useEffect(() => {
 *         // do the api call and update state
 *     }, [request]); // run the effect when the request changes
 * }
 * ```
 *
 * you can also see this plays out in the testcase.
 *
 * this is a really small hook but it's very important because it allows us to implement other hooks like useQuery
 * that automagically refresh when their inputs change without the library use needing to list off a really
 * long hook deps array.
 *
 */
export function useCompareMemo<T>(value: T): T {
    const ref = useRef<T>(value);

    if (!isEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}
