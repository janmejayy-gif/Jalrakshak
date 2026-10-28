package com.jalrakshak.health;

import com.jalrakshak.ml.MlServiceClient;
import com.jalrakshak.security.JwtService;
import com.jalrakshak.security.TokenBlacklistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HealthController.class)
@AutoConfigureMockMvc(addFilters = false)
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DataSource dataSource;

    @MockBean
    private MlServiceClient mlServiceClient;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;

    @Test
    void healthEndpointReturnsUp() throws Exception {
        Connection mockConnection = mock(Connection.class);
        when(mockConnection.isValid(2)).thenReturn(true);
        when(dataSource.getConnection()).thenReturn(mockConnection);
        when(mlServiceClient.healthCheck()).thenReturn(true);

        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("UP"))
            .andExpect(jsonPath("$.service").value("jalrakshak-backend"))
            .andExpect(jsonPath("$.timestamp").exists());
    }
}
