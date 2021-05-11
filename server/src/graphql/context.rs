use crate::environment::Environment;
use crate::session::Session;

#[derive(Shrinkwrap, Debug)]
pub struct Context {
    #[shrinkwrap(main_field)]
    env: Environment,
    session: Option<Session>,
}

impl Context {
    pub fn new(env: Environment, maybe_token: Option<String>) -> Self {
        let session = maybe_token.and_then(|token| Session::new(&env, &token).ok());
        Self { env, session }
    }

    pub fn env(&self) -> &Environment {
        &self.env
    }

    pub fn session(&self) -> Option<&Session> {
        self.session.as_ref()
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
