package com.alphabirdztest;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.alphabirdz.controller.UserRestController;
import com.alphabirdz.model.User;
import com.alphabirdz.repository.UserRepository;

@SpringBootTest(classes = com.alphabirdz.AlphabirdzApplication.class)
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class UserRestControllerTest {

    @Autowired
    private UserRestController userRestController;

    @MockBean
    private UserRepository userRepository;

    private MockMvc mockMvc;

    private User user;

    @Before
    public void onInit() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(userRestController)
        		.build();
        user = new User("kalpic", "kal", "kal@email.com", "kalpassword");
    }

    @Test
    public void getIdSuccess() throws Exception {
        given(this.userRepository.findById(1)).willReturn(user);
        this.mockMvc.perform(get("/users/id/1")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.username").value("kal")) 
            .andExpect(jsonPath("$.password").value("kalpassword"));
    }

    @Test
    public void getIdNotFound() throws Exception {
        given(this.userRepository.findById(2)).willReturn(null);
        this.mockMvc.perform(get("/users/id/2")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }

    @Test
    public void getUsernameSuccess() throws Exception {
        given(this.userRepository.findByUsername("kal")).willReturn(user); 
        this.mockMvc.perform(get("/users/name/kal")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.profilePhoto").value("kalpic"))
            .andExpect(jsonPath("$.username").value("kal")); 
    }

    @Test
    public void getUsernameNotFound() throws Exception {
        given(this.userRepository.findByUsername("jullie")).willReturn(null);
        this.mockMvc.perform(get("/users/name/jullie")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNotFound());
    }
}