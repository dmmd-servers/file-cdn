// Defines root route function
export async function rootRoute(request: Request, server: Bun.Server): Promise<Response> {
    return new Response("ok");
}

// Exports
export default rootRoute;
