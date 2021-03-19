#[macro_use]
extern crate dotenv_codegen;
#[macro_use]
extern crate shrinkwraprs;

mod auth;
mod environment;
mod errors;
mod graphql;
mod model;
mod session;
mod sql;

use crate::environment::Environment;
use crate::errors::Error;
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use async_graphql_warp::Response;
use std::convert::Infallible;
use std::fs;
use warp::http::Response as HttpResponse;
use warp::Filter;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let database_url = dotenv!("DATABASE_URL");
    let redis_url = dotenv!("REDIS_URL");
    let jwt_secret = dotenv!("JWT_SECRET");
    let env = Environment::new(database_url, redis_url, jwt_secret).await?;
    let env = warp::any().map(move || env.clone());

    let html =
        fs::read_to_string("../client/public/index.html").expect("Could not find index.html");
    let static_files = warp::fs::dir("../client/public");
    let frontend = warp::path::end().map(move || warp::reply::html(html.to_string()));

    let graphql = {
        let token = warp::header("authorization")
            .map(Some)
            .or(warp::any().map(|| None))
            .unify();

        let refresh_token = warp::cookie("refresh_token")
            .map(Some)
            .or(warp::any().map(|| None))
            .unify();

        let context = warp::any()
            .and(env.clone())
            .and(token)
            .and(refresh_token)
            .and_then(|env, token, refresh_token| async {
                graphql::Context::new(env, token, refresh_token)
                    .await
                    .map_err(warp::Rejection::from)
            })
            .boxed();

        let schema = graphql::schema();

        let post = context.and(async_graphql_warp::graphql(schema)).and_then(
            |context, (schema, request): (graphql::Schema, async_graphql::Request)| async move {
                let request = request.data(context);
                Ok::<_, Infallible>(Response::from(schema.execute(request).await))
            },
        );

        let playground = warp::get().map(|| {
            HttpResponse::builder()
                .header("content-type", "text/html")
                .body(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
        });

        warp::path("graphql")
            .and(warp::path::end())
            .and(playground.or(post))
    };

    let routes = graphql.or(static_files).or(frontend);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;

    Ok(())
}
