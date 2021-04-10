use crate::environment::Environment;
use crate::errors::Error;
use crate::session::Session;

#[derive(Shrinkwrap)]
pub struct Context {
    #[shrinkwrap(main_field)]
    env: Environment,
    session: Option<Session>,
    refresh_session: Option<Session>,
}

impl Context {
    pub async fn new(
        env: Environment,
        maybe_token: Option<String>,
        maybe_refresh_token: Option<String>,
    ) -> Result<Self, Error> {
        let session = if let Some(token) = maybe_token {
            Session::new(env.clone(), &token).await?
        } else {
            None
        };
        let refresh_session = if let Some(refresh_token) = maybe_refresh_token {
            Session::new(env.clone(), &refresh_token).await?
        } else {
            None
        };
        Ok(Self {
            env,
            session,
            refresh_session,
        })
    }

    pub fn session(&self) -> Option<&Session> {
        self.session.as_ref()
    }
    pub fn refresh_session(&self) -> Option<&Session> {
        self.refresh_session.as_ref()
    }

    pub fn has_role(&self, role: &str) -> bool {
        match &self.session {
            Some(session) => session
                .roles()
                .iter()
                .map(|role| (&role.name).to_string())
                .collect::<String>()
                .contains(role),
            None => false,
        }
    }
}
