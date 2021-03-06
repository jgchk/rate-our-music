#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error(transparent)]
    DatabaseError(#[from] sqlx::Error),
    #[error(transparent)]
    RedisError(#[from] redis::RedisError),
    #[error(transparent)]
    JWTError(#[from] jsonwebtoken::errors::Error),
    #[error("invalid credentials")]
    InvalidCredentials,
}

impl warp::reject::Reject for Error {}

impl Into<String> for Error {
    fn into(self) -> String {
        format!("{:?}", self)
    }
}
