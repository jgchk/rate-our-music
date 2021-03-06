use crate::environment::Environment;
use crate::errors::Error;
use crate::session::Session;

#[derive(Shrinkwrap)]
pub struct Context {
    #[shrinkwrap(main_field)]
    env: Environment,
    session: Option<Session>,
}

impl Context {
    pub async fn new(env: Environment, maybe_jwt: Option<String>) -> Result<Self, Error> {
        let session = if let Some(jwt) = maybe_jwt {
            Session::new(env.clone(), &jwt).await?
        } else {
            None
        };
        Ok(Self { env, session })
    }

    pub fn session(&self) -> Option<&Session> {
        self.session.as_ref()
    }

    pub fn is_authenticated(&self) -> bool {
        self.session.is_some()
    }
}
